import { prisma } from "../prisma"
import bcrypt from 'bcrypt'
import logger from "../utils/logger"

const users = [
  {
    email: "antoine@smashpros.io",
    password: "antoine",
    tag: "shaark"
  },
  {
    email: "glutonny@smashpros.io",
    password: "glutonny",
    tag: "Glutonny"
  }
]

export async function loadUsers() {
  logger.info('Creating users ...')
  const batch = []

  for (let user of users) {
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(user.password, salt)

    batch.push(
      prisma.user.create({
        data: {
          password: hash,
          email: user.email,
          tag: user.tag
        }
      })
    )
  }

  return Promise.all(batch)
}