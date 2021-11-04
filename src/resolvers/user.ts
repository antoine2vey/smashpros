import { prisma } from "../prisma";
import bcrypt from 'bcrypt'
import { AuthenticationError, UserInputError } from "apollo-server";
import jwt from 'jsonwebtoken'
import { uploadFile } from "../utils/aws";
import { v4 as uuid } from 'uuid';
import { mapIdsToPrisma } from "../utils/prisma";
import { addMinutes, isAfter } from "date-fns";
import { getRole } from "../utils/roles";
import { RoleEnum } from "@prisma/client";
import { forgotPasswordSchema, emailSchema, registerSchema, smashGGSlug } from "../validations/user";
import { MutationArg, QueryArg, SmashGG } from "../typings/interfaces"
import smashGGClient from "../smashGGClient";
import { gql } from "graphql-request";

export const usersByCharacter: QueryArg<"usersByCharacter"> = (_, { id }, ctx, info) => {
  return prisma.user.findMany({
    include: {
      characters: true
    },
    where: {
      characters: {
        some: {
          id: {
            equals: id
          }
        }
      }
    }
  })
}

export const updateProfile: MutationArg<"updateProfile"> = async (_, { payload }, ctx, info) => {
  let awsUri: string;
  const { user } = ctx
  const { email, tag, profilePicture, characters } = payload
  
  // If we have a profile picture, update it
  if (profilePicture) {
    const { createReadStream, filename, mimetype } = await profilePicture
    awsUri = await uploadFile(createReadStream, `${user.id}-${filename}`, mimetype)
  }

  return prisma.user.update({
    include: {
      characters: true
    },
    where: {
      id: user.id
    },
    data: {
      email,
      tag,
      ...(profilePicture && {profile_picture: awsUri}),
      characters: {
        connect: mapIdsToPrisma(characters)
      }
    }
  })
}

export const askPasswordReset: MutationArg<"askPasswordReset"> = async (_, { email }, ctx, info) => {
  const { error } = emailSchema.validate(email)
  const code = uuid()
  const now = new Date()
  const expiration = addMinutes(now, 10)

  if (error) {
    throw new UserInputError('Email is not valid')
  }

  try {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        reset_token: code,
        reset_token_expiration: expiration
      }
    })
  
    return `We sent you an email (code: ${code})`
  } catch (error) {
    return `We sent you an email`
  }
}

export const passwordReset: MutationArg<"passwordReset"> = async (_, { code, password, confirmPassword }, ctx, info) => {
  const { error } = forgotPasswordSchema.validate({ code, password, confirmPassword })
  const user = await prisma.user.findFirst({ where: { reset_token: code }})
  const now = new Date()
  const isExpired = user ? isAfter(now, user.reset_token_expiration) : false

  if (error) {
    throw new UserInputError(error.message)
  }

  if (!user || isExpired) {
    throw new AuthenticationError('Not authorized')
  }

  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)

  await prisma.user.update({
    where: {
      email: user.email
    },
    data: {
      password: hash,
      reset_token_expiration: null,
      reset_token: null
    }
  })

  return true
}

export const login: MutationArg<"login"> = async (_, { email, password }, ctx, info) => {
  const user = await prisma.user.findUnique({ where: { email }, include: { roles: true }})
  
  if (user) {
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      throw new AuthenticationError('Bad credentials')
    }

    const userId = user.id
    const userRoles = user.roles.map(role => role.name)
    const token = jwt.sign({ userId, userRoles }, process.env.JWT_PASSWORD, { expiresIn: '1h' })

    return {
      token
    }
  } else {
    throw new AuthenticationError('Bad credentials')
  }
}

export const register: MutationArg<"register"> = async (_, { payload }, ctx, info) => {
  const { password, email, tag, profilePicture, characters } = payload
  const { createReadStream, filename, mimetype } = await profilePicture
  const id = uuid()
  const saltRounds = 10
  const { error } = registerSchema.validate(payload)

  if (error) {
    throw new UserInputError(error.message)
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds)
    const [hash, awsUri, role] = await Promise.all([
      bcrypt.hash(password, salt),
      uploadFile(createReadStream, `${id}-${filename}`, mimetype),
      getRole(RoleEnum.USER)
    ])

    return prisma.user.create({
      include: {
        characters: true
      },
      data: {
        email,
        tag,
        password: hash,
        profile_picture: awsUri,
        roles: {
          connect: [{ id: role.id }]
        },
        characters: {
          connect: mapIdsToPrisma(characters)
        }
      } 
    })
  } catch (error) {
    console.log(error)
    throw new UserInputError('Something went wrong with register.')
  }
}

export const suggestedName: QueryArg<"suggestedName"> = async (_, { slug }, ctx, info) => {
  const { error } = smashGGSlug.validate(slug)

  if (error) {
    throw new UserInputError(error.message)
  }

  const query = gql`
    query profile($slug: String!) {
      user(slug: $slug) {
        discriminator
        player {
          gamerTag
        }
      }
    }
  `
  const { user } = await smashGGClient.request<{ user: SmashGG.User | null }, { slug: string }>(query, { slug })
  if (!user) {
    return null
  }

  return user.player.gamerTag
}