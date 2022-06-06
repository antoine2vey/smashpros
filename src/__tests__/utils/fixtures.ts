import { Prisma, Role, RoleEnum, User } from '@prisma/client'
import { loadCharacters } from '../../seeds/characters'
import { loadRoles } from '../../seeds/roles'
import { getRole } from '../../utils/roles'
import jwt from 'jsonwebtoken'

export async function getToken(
  user: User & {
    roles: Role[]
  }
) {
  const userId = user.id
  const userRoles = user.roles.map((role) => role.name)
  const token = jwt.sign(
    { userId, userRoles },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
  )

  return token
}

export async function createUser(data: Prisma.UserCreateInput) {
  const USER_ROLE = await getRole(RoleEnum.USER)

  return prisma.user.create({
    data: {
      ...data,
      roles: {
        connect: {
          id: USER_ROLE.id
        }
      }
    },
    include: {
      roles: true
    }
  })
}

export async function runBaseFixtures() {
  return Promise.all([loadCharacters(), loadRoles()])
}

export async function deleteFixtures() {
  return prisma.$transaction([
    prisma.character.deleteMany(),
    prisma.role.deleteMany(),
    prisma.battle.deleteMany(),
    prisma.crew.deleteMany(),
    prisma.event.deleteMany(),
    prisma.tournament.deleteMany(),
    prisma.user.deleteMany(),
    prisma.match.deleteMany()
  ])
}
