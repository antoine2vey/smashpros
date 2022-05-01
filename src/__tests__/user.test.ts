import { ApolloServer, gql } from 'apollo-server-express'
import { config } from '../config'
import path from 'path'
import graphQLUpload from './utils/graphQLUpload'
import closeAllConnections from './utils/closeConnections'
import { prisma } from '../prisma'
import { decode } from 'jsonwebtoken'
import { createTestClient } from './utils/apolloServerTesting'
import { Character, User } from '@prisma/client'
import { getToken, removeToken, setToken } from './utils/user'

const apolloServer = new ApolloServer(config)
const { query, mutate, setOptions } = createTestClient({ apolloServer })

describe('GraphQL user endpoints', () => {
  describe('User register', () => {
    it('should register an user', async () => {
      const QUERY = gql`
        mutation register($payload: UserRegisterPayload) {
          register(payload: $payload) {
            id
          }
        }
      `

      const filePath = path.join(__dirname, 'utils', 'files', 'pepega.jpg')
      const upload = graphQLUpload(filePath)
      const { data, errors } = await mutate<{ register: User }>(QUERY, {
        variables: {
          payload: {
            email: 'user@smashpros.io',
            password: 'password',
            tag: 'user',
            profilePicture: upload,
            characters: []
          }
        }
      })

      expect(errors).toBeUndefined()
      expect(data).toBeDefined()
      // We have a real uuid
      expect(data.register.id).toHaveLength(36)
    })

    it('should throw if user already exists', async () => {
      const QUERY = gql`
        mutation register($payload: UserRegisterPayload) {
          register(payload: $payload) {
            id
          }
        }
      `

      const filePath = path.join(__dirname, 'utils', 'files', 'pepega.jpg')
      const upload = graphQLUpload(filePath)
      const { data, errors } = await mutate(QUERY, {
        variables: {
          payload: {
            email: 'user@smashpros.io',
            password: 'password',
            tag: 'user',
            profilePicture: upload,
            characters: []
          }
        }
      })

      expect(errors.length).toBeGreaterThanOrEqual(1)
      expect(data).toBeNull()
    })

    it('should throw if email is malformed', async () => {
      const QUERY = gql`
        mutation register($payload: UserRegisterPayload) {
          register(payload: $payload) {
            id
          }
        }
      `

      const filePath = path.join(__dirname, 'utils', 'files', 'pepega.jpg')
      const upload = graphQLUpload(filePath)
      const { data, errors } = await mutate<{ register: User }>(QUERY, {
        variables: {
          payload: {
            email: 'malformed_email',
            password: 'password',
            tag: 'user',
            profilePicture: upload,
            characters: []
          }
        }
      })

      expect(errors.length).toBeGreaterThanOrEqual(1)
      expect(data).toBeNull()
    })

    it('should link multiple character to user', async () => {
      const QUERY = gql`
        mutation register($payload: UserRegisterPayload) {
          register(payload: $payload) {
            id
            characters {
              name
            }
          }
        }
      `

      const filePath = path.join(__dirname, 'utils', 'files', 'pepega.jpg')
      const upload = graphQLUpload(filePath)
      const [luigi, zss] = await prisma.$transaction([
        prisma.character.findUnique({ where: { name: 'Luigi' } }),
        prisma.character.findUnique({ where: { name: 'Zero Suit Samus' } })
      ])

      const { data, errors } = await mutate<{
        register: User & { characters: Character[] }
      }>(QUERY, {
        variables: {
          payload: {
            email: 'characters@smashpros.io',
            password: 'password',
            tag: 'characters',
            profilePicture: upload,
            characters: [luigi.id, zss.id]
          }
        }
      })

      expect(errors).toBeUndefined()
      expect(data).toBeDefined()
      // We have a real uuid
      expect(data.register.id).toHaveLength(36)
      // 2 characters registered
      expect(data.register.characters).toHaveLength(2)
    })
  })

  describe('User login', () => {
    it('should get a token from a valid user login', async () => {
      const QUERY = gql`
        mutation login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
          }
        }
      `

      const { data, errors } = await mutate<{ login: { token: string } }>(
        QUERY,
        {
          variables: {
            email: 'user@smashpros.io',
            password: 'password'
          }
        }
      )

      expect(errors).toBeUndefined()
      expect(data.login.token).toBeTruthy()
      // @ts-ignore
      const { userId, userRoles } = decode(data.login.token)
      expect(userId).toHaveLength(36)
      expect(userRoles).toBeTruthy()
      expect(userRoles).toHaveLength(1)
    })

    it('should not get a token from an invalid user login', async () => {
      const QUERY = gql`
        mutation login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
          }
        }
      `

      const { data, errors } = await mutate<{ login: { token: string } }>(
        QUERY,
        {
          variables: {
            email: 'invalid@smashpros.io',
            password: 'password'
          }
        }
      )

      expect(errors[0].message).toBe('Bad credentials')
      expect(data).toBeNull()
    })
  })

  describe('User update profile', () => {
    it.skip('should', async () => {
      const QUERY = gql`
        mutation updateProfile($payload: UserUpdatePayload!) {
          updateProfile(payload: $payload) {
            email
            tag
            profilePicture
            characters
          }
        }
      `
    })
  })

  describe('Users by character', () => {
    beforeEach(async () => {
      const token = await getToken('user@smashpros.io')
      setToken(setOptions, token)
    })

    it('should be a protected resource', async () => {
      removeToken(setOptions)

      const luigi = await prisma.character.findUnique({
        where: { name: 'Luigi' }
      })
      const QUERY = gql`
        query usersByCharacter($id: ID!) {
          usersByCharacter(characterId: $id) {
            id
          }
        }
      `

      const { data, errors } = await query<{ usersByCharacter: User[] }>(
        QUERY,
        {
          variables: {
            id: luigi.id
          }
        }
      )

      expect(errors).toBeDefined()
      expect(data.usersByCharacter).toEqual(null)
    })

    it('should find all users by a character', async () => {
      const luigi = await prisma.character.findUnique({
        where: { name: 'Luigi' }
      })
      const QUERY = gql`
        query usersByCharacter($id: ID!) {
          usersByCharacter(characterId: $id) {
            id
          }
        }
      `

      const { data, errors } = await query<{ usersByCharacter: User[] }>(
        QUERY,
        {
          variables: {
            id: luigi.id
          }
        }
      )

      expect(errors).toBeUndefined()
      expect(data.usersByCharacter).toHaveLength(1)
    })

    it('should find all users by a character but no users', async () => {
      const peach = await prisma.character.findUnique({
        where: { name: 'Peach' }
      })
      const QUERY = gql`
        query usersByCharacter($id: ID!) {
          usersByCharacter(characterId: $id) {
            id
          }
        }
      `

      const { data, errors } = await query<{ usersByCharacter: User[] }>(
        QUERY,
        {
          variables: {
            id: peach.id
          }
        }
      )

      expect(errors).toBeUndefined()
      expect(data.usersByCharacter).toHaveLength(0)
    })

    afterAll(() => {
      removeToken(setOptions)
    })
  })
})

afterAll(() => {
  return closeAllConnections(apolloServer)
})
