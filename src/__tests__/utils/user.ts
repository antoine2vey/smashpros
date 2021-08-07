import { prisma } from "../../prisma";
import jwt from 'jsonwebtoken'

export function getUser(email: string) {
  return prisma.user.findUnique({
    where: {
      email
    },
    include: {
      characters: true,
      crew: true,
      waiting_crew: true,
      roles: true
    }
  })
}

export async function getToken(email: string) {
  const user = await getUser(email)
  const userId = user.id
  const userRoles = user.roles.map(role => role.name)
  const token = jwt.sign({ userId, userRoles }, process.env.JWT_PASSWORD, { expiresIn: '1h' })

  return token
}

export function setToken(instance: any, token: string) {
  instance({
    request: {
      headers: {
        authorization: token
      }
    }
  })
}

export function removeToken(instance: any) {
  instance({
    request: {
      headers: {}
    }
  })
}

export function createUser(tag: string, email: string) {
  return prisma.user.create({
    data: {
      email,
      tag,
      password: "password",
      profile_picture: "://profile_picture"
    }
  })
}