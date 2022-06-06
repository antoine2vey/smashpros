import { Prisma } from '@prisma/client'

export const VALID_USER_MOCK: Prisma.UserCreateInput = {
  email: 'test@smashpros.io',
  password: 'test',
  tag: 'Test'
}
