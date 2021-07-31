import { prisma } from "../prisma";
import bcrypt from 'bcrypt'
import { AuthenticationError, UserInputError } from "apollo-server";
import jwt from 'jsonwebtoken'
import { uploadFile } from "../utils/aws";
import { v4 as uuid } from 'uuid';
import { mapIdsToPrisma } from "../utils/prisma";
import { combineResolvers } from 'graphql-resolvers'
import { addMinutes, isAfter } from "date-fns";
import { isAuthenticated } from "../middlewares";
import { getRole } from "../utils/roles";
import { RoleEnum } from "@prisma/client";
import {pubsub} from "../redis";
import { forgotPasswordSchema, emailSchema, registerSchema } from "../validations/user";
import { PubSubActions } from "../typings/enums";
import { PlayerByCharacterParams, UserCreateInput, UserUpdateInput } from "../typings/interfaces"

const users = () => {
  return prisma.user.findMany({
    include: {
      characters: true
    }
  })
}

const usersByCharacter = (_, { characterId }: PlayerByCharacterParams) => {
  return prisma.user.findMany({
    include: {
      characters: true
    },
    where: {
      characters: {
        some: {
          id: {
            equals: characterId
          }
        }
      }
    }
  })
}

const updateProfile = async (_, { payload }: { payload: UserUpdateInput }, ctx) => {
  const { user } = ctx
  const { id, email, tag, profilePicture, characters, prefix } = payload
  const { createReadStream, filename, mimetype } = await profilePicture
  const awsUri = await uploadFile(createReadStream, `${id}-${filename}`, mimetype)

  if (user.id !== id) {
    throw new AuthenticationError('Not allowed')  
  }

  return prisma.user.update({
    include: {
      characters: true
    },
    where: {
      id
    },
    data: {
      email,
      tag,
      prefix,
      profile_picture: awsUri,
      characters: {
        connect: mapIdsToPrisma(characters)
      }
    }
  })
}

const askPasswordReset = async (_, { email }: { email: string }) => {
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

const passwordReset = async (_, { code, password, confirm_password }: { code: string, password: string, confirm_password: string }) => {
  const { error } = forgotPasswordSchema.validate({ code, password, confirm_password })
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

const login = async (_, { email, password }) => {
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

const register = async (_, { payload }: {payload: UserCreateInput}) => {
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
    throw new UserInputError('Something went wrong with register.')
  }
}

const userEnteredTournament = {
  subscribe: () => pubsub.asyncIterator(PubSubActions.USER_ENTERED_TOURNAMENT)
}

export const userResolver = {
  Query: {
    users: combineResolvers(
      isAuthenticated,
      users
    ),
    usersByCharacter: combineResolvers(
      isAuthenticated,
      usersByCharacter
    )
  },
  Mutation: {
    register: combineResolvers(
      register
    ),
    login: combineResolvers(
      login
    ),
    updateProfile: combineResolvers(
      isAuthenticated,
      updateProfile
    ),
    askPasswordReset: combineResolvers(
      askPasswordReset
    ),
    passwordReset: combineResolvers(
      passwordReset
    )
  },
  Subscription: {
    userEnteredTournament
  }
}