import { prisma } from "../prisma";
import bcrypt from 'bcrypt'
import { AuthenticationError, UserInputError } from "apollo-server";
import jwt from 'jsonwebtoken'
import { sizes, uploadFile } from "../utils/storage";
import { mapIdsToPrisma } from "../utils/prisma";
import { addMinutes, isAfter } from "date-fns";
import { getRole } from "../utils/roles";
import { RoleEnum } from "@prisma/client";
import { forgotPasswordSchema, emailSchema, registerSchema, smashGGSlug } from "../validations/user";
import { MutationArg, QueryArg, SmashGG } from "../typings/interfaces"
import smashGGClient from "../smashGGClient";
import { gql } from "graphql-request";
import { randomUUID } from "crypto";
import { cache, cacheKeys } from "../redis"

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

export const user: QueryArg<"user"> =async (_, { id: userId }, ctx, info) => {
  const id = userId || ctx.user.id

  return prisma.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      profile_picture: true,
      lat: true,
      lng: true,
      in_tournament: true,
      crew: true,
      characters: true,
      email: true,
      tag: true,
      twitch_username: true,
      twitter_username: true,
      smashgg_slug: true,
      allow_notifications: true,
      allow_searchability: true,
      waiting_crew: true,
      favorited_tournaments: true,
      tournaments: true,
      updated_at: true,
      created_at: true
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
    uri = await uploadFile(createReadStream, `${randomUUID()}-${filename}`, sizes.profile)
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
  const user = await prisma.user.findUnique({ where: { email }, include: { roles: true }})
  
  if (user) {
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      throw new AuthenticationError('Bad credentials')
    }

    const userId = user.id
    const userRoles = user.roles.map(role => role.name)
    const accessToken = jwt.sign({ userId, userRoles }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' })
    const refreshToken = jwt.sign({ userId, userRoles }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' })

    await cache.hset(cacheKeys.refreshTokens, refreshToken, accessToken)

    return {
      accessToken,
      refreshToken
    }
  } else {
    throw new AuthenticationError('Bad credentials')
  }
}

export const refresh: MutationArg<"refresh"> = async (_, { refreshToken }, ctx, info) => {
  const exists = await cache.hexists(cacheKeys.refreshTokens, refreshToken)

  if (exists) {
    const token = await cache.hget(cacheKeys.refreshTokens, refreshToken)
    // @ts-ignore
    const { userId } = jwt.decode(token)
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { roles: true }})
    const userRoles = user.roles.map(role => role.name)
    const accessToken = jwt.sign({ userId, userRoles }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' })

    await cache.hset(cacheKeys.refreshTokens, refreshToken, accessToken)

    return {
      accessToken
    }
  } else {
    // token does not exist, it's been revoked
    throw new AuthenticationError('Something bad happened')
  }
}

export const register: MutationArg<"register"> = async (_, { payload }, ctx, info) => {
  const { password, email, tag, profilePicture, characters, smashGGPlayerId, smashGGSlug, smashGGUserId } = payload
  const id = randomUUID()
  const saltRounds = 10
  const { error } = registerSchema.validate(payload)

  if (smashGGSlug) {
    const exists = await prisma.user.findUnique({ where: { smashgg_slug: smashGGSlug }})

    if (exists) {
      throw new UserInputError('SmashGG Id is already used')
    }
  }

  if (error) {
    throw new UserInputError(error.message)
  }

  try {
    const { createReadStream, filename, mimetype } = await profilePicture
    const salt = await bcrypt.genSalt(saltRounds)
    const [hash, uri, role] = await Promise.all([
      bcrypt.hash(password, salt),
      uploadFile(createReadStream, `${id}-${filename}`, sizes.profile),
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
    throw new UserInputError('Something went wrong with register.')
  }
}

export const suggestedName: QueryArg<"suggestedName"> = async (_, { slug }, ctx, info) => {
  const { error } = smashGGSlug.validate(slug)
  const exists = await prisma.user.findUnique({ where: { smashgg_slug: slug }})

  if (!!exists) {
    throw new UserInputError('SmashGG Id already used')
  }

  if (error) {
    throw new UserInputError(error.message)
  }

  const { user } = await smashGGClient.request<{ user: SmashGG.User }, { slug: string }>(query, { slug })

  if (!user) {
    throw new UserInputError('SmashGG Id does not exists')
  }

  return {
    tag: user.player.gamerTag,
    smashGGPlayerId: user.player.id,
    smashGGUserId: user.id,
    profilePicture: user.images.length > 0 ? user.images[1].url : null
  }
}