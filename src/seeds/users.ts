import { prisma } from "../prisma"
import bcrypt from 'bcrypt'
import logger from "../utils/logger"

const users = [
  {
    email: "antoine@smashpros.io",
    password: "antoine",
    tag: "shaark",
    smashgg_player_id: 2143265
  },
  {
    email: "glutonny@smashpros.io",
    password: "glutonny",
    tag: "Glutonny",
    smashgg_player_id: 6122
  },
  {
    email: "og@smashpros.io",
    password: "og",
    tag: "Ogey",
    smashgg_player_id: 64991
  }
]

export async function loadUsers() {
  await prisma.user.deleteMany({})
  await prisma.character.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.tournament.deleteMany({})
  await prisma.role.deleteMany({})

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
          tag: user.tag,
          smashgg_player_id: user.smashgg_player_id
        }
      })
    )
  }

  return Promise.all(batch)
}