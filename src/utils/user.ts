import { Role, User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { prisma } from '../prisma'
import { cache, cacheKeys } from '../redis'
import logger from './logger'
import redisNamingStrategy from './redisNamingStrategy'

export async function findUserByToken(token: string) {
  if (!token) {
    return null
  }

  const now = +new Date()
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  if (!decoded) {
    return null
  }

  // @ts-ignore
  const { exp, userId } = decoded
  const key = cacheKeys.user(userId)
  const exists = await cache.exists(key)
  let populatedUser: User & { roles: Role[] } = null

  /**
   * Scheme:
   *  - On login, set user in cache (exp for accessToken = 1800s)
   *  - On refresh, set user back in cache (exp for accessToken = 1800s)
   *  - On every request :
   *    Return null if we have no token / verification failed
   *    Then we have a valid token,
   *      If user is in cache return it
   *      Else, fetch it, but we should never get to this point
   */

  if (exists) {
    logger.info(`Found user in cache (${key})`)
    const cachedUserString = await cache.get(key)
    populatedUser = JSON.parse(cachedUserString)
  } else {
    logger.info(`Creating new user entry in cache (${key})`)
    populatedUser = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        roles: true
      }
    })
    cache.setex(key, 1800, JSON.stringify(populatedUser))
  }

  const user = now > exp ? populatedUser : null

  return user
}
