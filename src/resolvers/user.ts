import { prisma } from "../prisma";
import bcrypt from 'bcrypt'
import { AuthenticationError, UserInputError } from "apollo-server";
import jwt from 'jsonwebtoken'
import { resizers, uploadFile } from "../utils/storage";
import { mapIdsToPrisma } from "../utils/prisma";
import { addMinutes, isAfter } from "date-fns";
import { getRole } from "../utils/roles";
import { RoleEnum } from "@prisma/client";
import { forgotPasswordSchema, emailSchema, registerSchema, smashGGSlug } from "../validations/user";
import { MutationArg, QueryArg, SmashGG } from "../typings/interfaces"
import smashGGClient from "../smashGGClient";
import { gql } from "graphql-request";
import { randomUUID } from "crypto";

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
  let uri: string;
  const { user } = ctx
  const { email, tag, profilePicture, characters, twitterUsername, twitchUsername } = payload
  
  // If we have a profile picture, update it
  if (profilePicture) {
    const { createReadStream, filename, mimetype } = await profilePicture
    uri = await uploadFile(createReadStream, `${randomUUID()}-${filename}`, resizers.profile)
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
      ...(profilePicture && {profile_picture: uri}),
      ...(twitterUsername && { twitter_username: twitterUsername }),
      ...(twitchUsername && { twitch_username: twitchUsername }),
      characters: {
        connect: mapIdsToPrisma(characters)
      }
    }
  })
}

export const askPasswordReset: MutationArg<"askPasswordReset"> = async (_, { email }, ctx, info) => {
  const { error } = emailSchema.validate(email)
  const code = randomUUID()
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
  const { password, email, tag, profilePicture, characters, smashGGPlayerId, smashGGSlug, smashGGUserId } = payload
  const { createReadStream, filename, mimetype } = await profilePicture
  const id = randomUUID()
  const saltRounds = 10
  const { error } = registerSchema.validate(payload)


  if (error) {
    throw new UserInputError(error.message)
  }

  try {
    const salt = await bcrypt.genSalt(saltRounds)
    const [hash, uri, role] = await Promise.all([
      bcrypt.hash(password, salt),
      uploadFile(createReadStream, `${id}-${filename}`, resizers.profile),
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
        profile_picture: uri,
        smashgg_player_id: smashGGPlayerId,
        smashgg_user_id: smashGGUserId,
        smashgg_slug: smashGGSlug,
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
        id
        player {
          id
          gamerTag
        }
        images {
          url
        }
      }
    }
  `

  const { user } = await smashGGClient.request<{ user: SmashGG.User }, { slug: string }>(query, { slug })

  if (!user) {
    return null
  }

  return {
    tag: user.player.gamerTag,
    smashGGPlayerId: user.player.id,
    smashGGUserId: user.id,
    profilePicture: user.images.length > 0 ? user.images[0].url : null
  }
}