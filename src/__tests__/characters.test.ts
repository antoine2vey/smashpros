import { Role, User } from '@prisma/client'
import { gql } from 'apollo-server-express'
import { cache, pubsub } from '../redis'
import { context } from './mocks/context'
import { server } from './mocks/server'
import { VALID_USER_MOCK } from './mocks/user'
import closeAllConnections from './utils/closeConnections'
import {
  createUser,
  deleteFixtures,
  getToken,
  runBaseFixtures
} from './utils/fixtures'

describe('characters', () => {
  let user: User & {
    roles: Role[]
  } = null
  let token: string = null

  beforeAll(async () => {
    await runBaseFixtures()
    user = await createUser(VALID_USER_MOCK)
    token = await getToken(user)
  })

  describe('authenticated', () => {
    console.log(user)
    console.log(token)
    it('should fetch characters', async () => {
      const query = gql`
        query Characters {
          characters {
            id
            name
            picture
          }
        }
      `
      const result = await server.executeOperation({ query }, context())

      expect(result.errors).toBeUndefined()
      expect(result.data?.characters).toHaveLength(84)
      expect(result.data.characters[0].id).toBeTruthy()
      expect(result.data.characters[0].name).toBeTruthy()
      expect(result.data.characters[0].picture).toBeTruthy()
    })
  })

  describe('unauthenticated', () => {
    it('should fetch characters', async () => {
      const query = gql`
        query Characters {
          characters {
            id
            name
            picture
          }
        }
      `

      const result = await server.executeOperation({ query }, context())

      expect(result.errors).toBeUndefined()
      expect(result.data?.characters).toHaveLength(84)
      expect(result.data.characters[0].id).toBeTruthy()
      expect(result.data.characters[0].name).toBeTruthy()
      expect(result.data.characters[0].picture).toBeTruthy()
    })
  })
})

afterAll(async () => {
  await deleteFixtures()
  await closeAllConnections()
})
