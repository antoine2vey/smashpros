import { Role, User } from "@prisma/client"
import { decode } from "jsonwebtoken"
import { prisma } from "../prisma"

export async function findUserByToken(token: string) {
  const now = +new Date()
  const decoded = decode(token)

  console.log(token)
  console.log(decoded)

  if (!decoded) {
    return null
  }

  // @ts-ignore
  const { exp, userId } = decoded
  const populatedUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      roles: true
    }
  })
  const user = now > exp ? populatedUser : null

  return user
}