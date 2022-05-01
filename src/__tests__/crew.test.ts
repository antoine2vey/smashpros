import { Crew, User } from '@prisma/client'
import { ApolloServer, gql } from 'apollo-server-express'
import { config } from '../config'
import { prisma } from '../prisma'
import { CrewActions } from '../typings/enums'
import { createTestClient } from './utils/apolloServerTesting'
import closeAllConnections from './utils/closeConnections'
import {
  createUser,
  getToken,
  getUser,
  removeToken,
  setToken
} from './utils/user'

const apolloServer = new ApolloServer(config)
const { query, mutate, setOptions } = createTestClient({ apolloServer })

beforeAll(async () => {
  return prisma.$transaction([
    createUser('crew_admin', 'crew_admin@smashpros.io'),
    createUser('user1', 'user1@smashpros.io'),
    createUser('user2', 'user2@smashpros.io')
  ])
})

describe('GraphQL crew endpoints', () => {
  describe("Fetch user's crew", () => {
    it('should be a protected resource', async () => {
      const QUERY = gql`
        {
          crew {
            id
          }
        }
      `

      const { data, errors } = await query(QUERY)

      expect(errors[0].message).toEqual('Not authenticated')
      expect(data).toEqual({
        crew: null
      })
    })

    it('should return null if user has no crew', async () => {
      const token = await getToken('crew_admin@smashpros.io')
      setToken(setOptions, token)

      const QUERY = gql`
        {
          crew {
            id
          }
        }
      `

      const { data, errors } = await query(QUERY)

      expect(errors).toBeUndefined()
      expect(data).toEqual({
        crew: null
      })
    })

    afterAll(() => {
      removeToken(setOptions)
    })
  })

  describe('Create a crew', () => {
    beforeEach(async () => {
      const token = await getToken('crew_admin@smashpros.io')
      setToken(setOptions, token)
    })

    it('should be a protected resource', async () => {
      removeToken(setOptions)

      const QUERY = gql`
        mutation createCrew($name: String!, $prefix: String!) {
          createCrew(name: $name, prefix: $prefix) {
            id
            name
            prefix
            banner
            icon
            members {
              email
            }
          }
        }
      `

      const { data, errors } = await mutate<{
        createCrew: Crew & { members: User[] }
      }>(QUERY, {
        variables: {
          name: 'Test crew',
          prefix: 'CREW'
        }
      })

      expect(data).toEqual({ createCrew: null })
      expect(errors[0].message).toEqual('Not authenticated')
    })

    it('should create a crew for user', async () => {
      const user = await getUser('crew_admin@smashpros.io')
      const QUERY = gql`
        mutation createCrew($name: String!, $prefix: String!) {
          createCrew(name: $name, prefix: $prefix) {
            id
            name
            prefix
            banner
            icon
            members {
              email
            }
          }
        }
      `

      const { data, errors } = await mutate<{
        createCrew: Crew & { members: User[] }
      }>(QUERY, {
        variables: {
          name: 'Test crew',
          prefix: 'CREW'
        }
      })

      expect(errors).toBeUndefined()
      expect(data.createCrew.name).toEqual('Test crew')
      expect(data.createCrew.prefix).toEqual('CREW')
      expect(data.createCrew.members).toEqual([{ email: user.email }])
      expect(data.createCrew.banner).toBeTruthy()
      expect(data.createCrew.icon).toBeTruthy()
    })

    it('should throw if trying to create another crew', async () => {
      const QUERY = gql`
        mutation createCrew($name: String!, $prefix: String!) {
          createCrew(name: $name, prefix: $prefix) {
            id
            name
            prefix
            banner
            icon
            members {
              email
            }
          }
        }
      `

      const { data, errors } = await mutate<{
        createCrew: Crew & { members: User[] }
      }>(QUERY, {
        variables: {
          name: 'Another test crew',
          prefix: 'TESTCREW'
        }
      })

      expect(errors[0].message).toEqual('Already a crew admin')
      expect(data).toEqual({ createCrew: null })
    })

    afterAll(() => {
      removeToken(setOptions)
    })
  })

  describe('Join a crew', () => {
    it('should be a protected resource', async () => {
      const user = await getUser('crew_admin@smashpros.io')
      const QUERY = gql`
        mutation joinCrew($id: ID!) {
          joinCrew(id: $id) {
            name
          }
        }
      `

      const { data, errors } = await mutate(QUERY, {
        variables: {
          id: user.crew_id
        }
      })

      expect(data).toEqual({ joinCrew: null })
      expect(errors[0].message).toBe('Not authenticated')
    })

    it('should throw if user has already a crew', async () => {
      const user = await getUser('crew_admin@smashpros.io')
      const token = await getToken('crew_admin@smashpros.io')
      setToken(setOptions, token)

      const QUERY = gql`
        mutation joinCrew($id: ID!) {
          joinCrew(id: $id) {
            name
          }
        }
      `

      const { data, errors } = await mutate(QUERY, {
        variables: {
          id: user.crew_id
        }
      })

      expect(data).toEqual({ joinCrew: null })
      expect(errors[0].message).toBe('You already have a crew')
    })

    it('should join a crew', async () => {
      const crewAdmin = await getUser('crew_admin@smashpros.io')
      const token = await getToken('user1@smashpros.io')
      setToken(setOptions, token)

      const QUERY = gql`
        mutation joinCrew($id: ID!) {
          joinCrew(id: $id) {
            name
            members {
              email
            }
            waiting_members {
              email
            }
          }
        }
      `
      const { data, errors } = await mutate<{
        joinCrew: Crew & {
          members: User[]
          waiting_members: User[]
        }
      }>(QUERY, {
        variables: {
          id: crewAdmin.crew_id
        }
      })

      expect(errors).toBeUndefined()
      expect(data.joinCrew.members).toHaveLength(1)
      expect(data.joinCrew.waiting_members).toHaveLength(1)
    })

    it('should make another user join a crew', async () => {
      const crewAdmin = await getUser('crew_admin@smashpros.io')
      const token = await getToken('user2@smashpros.io')
      setToken(setOptions, token)

      const QUERY = gql`
        mutation joinCrew($id: ID!) {
          joinCrew(id: $id) {
            name
            members {
              email
            }
            waiting_members {
              email
            }
          }
        }
      `

      const { data, errors } = await mutate<{
        joinCrew: Crew & {
          members: User[]
          waiting_members: User[]
        }
      }>(QUERY, {
        variables: {
          id: crewAdmin.crew_id
        }
      })

      expect(errors).toBeUndefined()
      expect(data.joinCrew.members).toHaveLength(1)
      expect(data.joinCrew.waiting_members).toHaveLength(2)
    })
  })

  describe('Update a waiting member status', () => {
    it('should be a protected resource', async () => {
      removeToken(setOptions)
      const admin = await getUser('crew_admin@smashpros.io')
      const user = await getUser('user1@smashpros.io')
      const QUERY = gql`
        mutation updateWaitingMember($id: ID!, $action: String!) {
          updateWaitingMember(id: $id, action: $action) {
            name
            members {
              email
            }
            waiting_members {
              email
            }
          }
        }
      `

      const { data, errors } = await mutate(QUERY, {
        variables: {
          id: user.id,
          action: CrewActions.Update.ACCEPT
        }
      })

      expect(data).toEqual({ updateWaitingMember: null })
      expect(errors[0].message).toBe('Not authenticated')
    })

    it('should be forbidden for non crew admin', async () => {
      const admin = await getUser('crew_admin@smashpros.io')
      const user = await getUser('user1@smashpros.io')
      const token = await getToken('user1@smashpros.io')
      setToken(setOptions, token)

      const QUERY = gql`
        mutation updateWaitingMember($id: ID!, $action: String!) {
          updateWaitingMember(id: $id, action: $action) {
            name
            members {
              email
            }
            waiting_members {
              email
            }
          }
        }
      `

      const { data, errors } = await mutate(QUERY, {
        variables: {
          id: user.id,
          action: CrewActions.Update.ACCEPT
        }
      })

      expect(data).toEqual({ updateWaitingMember: null })
      expect(errors[0].message).toBe('Not a crew admin')
    })

    it('should update a crew member status (ACCEPT)', async () => {
      const user = await getUser('user1@smashpros.io')
      const token = await getToken('crew_admin@smashpros.io')
      setToken(setOptions, token)

      const QUERY = gql`
        mutation updateWaitingMember($id: ID!, $action: String!) {
          updateWaitingMember(id: $id, action: $action) {
            name
            members {
              email
            }
            waiting_members {
              email
            }
          }
        }
      `

      const { data, errors } = await mutate<{
        updateWaitingMember: Crew & {
          members: User[]
          waiting_members: User[]
        }
      }>(QUERY, {
        variables: {
          id: user.id,
          action: CrewActions.Update.ACCEPT
        }
      })

      expect(data.updateWaitingMember.waiting_members).toHaveLength(1)
      expect(data.updateWaitingMember.members).toHaveLength(2)
      expect(errors).toBeUndefined()
    })

    it('should update a crew member status (DENY)', async () => {
      const user = await getUser('user2@smashpros.io')
      const token = await getToken('crew_admin@smashpros.io')
      setToken(setOptions, token)

      const QUERY = gql`
        mutation updateWaitingMember($id: ID!, $action: String!) {
          updateWaitingMember(id: $id, action: $action) {
            name
            members {
              email
            }
            waiting_members {
              email
            }
          }
        }
      `

      const { data, errors } = await mutate<{
        updateWaitingMember: Crew & {
          members: User[]
          waiting_members: User[]
        }
      }>(QUERY, {
        variables: {
          id: user.id,
          action: CrewActions.Update.DENY
        }
      })

      expect(data.updateWaitingMember.waiting_members).toHaveLength(0)
      expect(data.updateWaitingMember.members).toHaveLength(2)
      expect(errors).toBeUndefined()
    })

    it('should update a crew member status (UNKNOWN)', async () => {
      const admin = await getUser('crew_admin@smashpros.io')
      const token = await getToken('user1@smashpros.io')
      setToken(setOptions, token)

      const QUERY = gql`
        mutation updateWaitingMember($id: ID!, $action: String!) {
          updateWaitingMember(id: $id, action: $action) {
            name
            members {
              email
            }
            waiting_members {
              email
            }
          }
        }
      `

      const { data, errors } = await mutate<{
        updateWaitingMembeers: Crew & {
          members: User[]
          waiting_members: User[]
        }
      }>(QUERY, {
        variables: {
          id: admin.id,
          action: 'UNKNOWN'
        }
      })

      expect(data).toEqual({ updateWaitingMember: null })
      expect(errors).toBeDefined()
    })

    afterAll(() => {
      removeToken(setOptions)
    })
  })
})

afterAll(() => {
  return closeAllConnections(apolloServer)
})
