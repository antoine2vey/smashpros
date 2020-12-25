import { prisma } from "../prisma";
import bcrypt from 'bcrypt'
import { AuthenticationError, UserInputError } from "apollo-server";
import jwt from 'jsonwebtoken'
import { uploadFile } from "../utils/aws";
import { v4 as uuid } from 'uuid';
import { mapIdsToPrisma } from "../utils/prisma";
import Joi from "joi"
import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated } from "../middlewares/isAuthenticated";

const registerSchema = Joi.object({
  password: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  tag: Joi.string().required()
})

export interface PlayerByCharacterParams {
  characterId: string
}

export interface UserCreateInput {
  id: string
  password: string
  email: string
  tag: string
  profilePicture: {
    filename: string
    mimetype: string
    encoding: string
    createReadStream: any //TODO: fix type
  }
  characters: string[]
}

export interface UserUpdateInput extends UserCreateInput {
  prefix: string
}

const updateProfile = async (_, { payload }: { payload: UserUpdateInput }, ctx) => {
  const { user } = ctx
  const { id, email, tag, profilePicture, characters, prefix } = payload

  if (user.id !== id) {
    throw new AuthenticationError('Not allowed')  
  }

  console.log(email, tag, prefix)

  return prisma.user.update({
    include: {
      characters: true
    },
    where: {
      id
    },
    data: {
      email,
      tag,
      prefix
    }
  })
}

export const userResolver = {
  Query: {
    users: () => {
      return prisma.user.findMany({
        include: {
          characters: true
        }
      })
    },
    usersByCharacter: (_, { characterId }: PlayerByCharacterParams) => {
      return prisma.user.findMany({
        include: {
          characters: true
        },
        where: {
          characters: {
            some: {
              id: {
                equals: characterId
              }
            }
          }
        }
      })
    }
  },
  Mutation: {
    register: async (_, { payload }: {payload: UserCreateInput}) => {
      const { password, email, tag, profilePicture, characters } = payload
      const { createReadStream, filename, mimetype } = await profilePicture
      const id = uuid()
      const saltRounds = 10
      const { error } = registerSchema.validate(payload)

      if (error) {
        throw new UserInputError(error.message)
      }

      try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt)
        const awsUri = await uploadFile(createReadStream, `${id}-${filename}`, mimetype)

        return prisma.user.create({
          include: {
            characters: true
          },
          data: {
            email,
            tag,
            password: hash,
            profile_picture: awsUri,
            characters: {
              connect: mapIdsToPrisma(characters)
            }
          } 
        })
      } catch (error) {
        throw new UserInputError('Something went wrong with register.')
      }
    },
    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } })
      
      if (user) {
        const match = await bcrypt.compare(password, user.password)

        if (!match) {
          throw new AuthenticationError('Bad credentials')
        }

        const userId = user.id
        const token = jwt.sign({ userId }, process.env.JWT_PASSWORD, { expiresIn: '1h' })

        return {
          token
        }
      } else {
        throw new AuthenticationError('Bad credentials')
      }
    },
    updateProfile: combineResolvers(
      isAuthenticated,
      updateProfile
    )
  }
}