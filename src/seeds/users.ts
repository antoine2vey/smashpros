import { prisma } from '../prisma'
import bcrypt from 'bcrypt'
import logger from '../utils/logger'
import { faker } from '@faker-js/faker'

const users = [
  {
    email: 'antoine@smashpros.io',
    password: 'antoine',
    tag: 'shaark',
    smashgg_player_id: 2143265,
    profile_picture: faker.image.avatar()
  },
  {
    email: 'glutonny@smashpros.io',
    password: 'glutonny',
    tag: 'Glutonny',
    smashgg_player_id: 6122,
    profile_picture: faker.image.avatar()
  },
  {
    email: 'og@smashpros.io',
    password: 'og',
    tag: 'Ogey',
    smashgg_player_id: 64991,
    profile_picture: faker.image.avatar()
  },
  ...Array(100)
    .fill(undefined)
    .map(() => ({
      email: faker.internet.email(),
      password: faker.internet.password(10),
      tag: faker.random.word(),
      profile_picture: faker.image.avatar(),
      smashgg_player_id: null
    }))
]

export async function loadUsers() {
  await prisma.user.deleteMany({})
  await prisma.character.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.tournament.deleteMany({})
  await prisma.role.deleteMany({})
  await prisma.crew.deleteMany({})

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
          smashgg_player_id: user.smashgg_player_id,
          profile_picture: user.profile_picture
        }
      })
    )
  }

  return Promise.all(batch)
}
