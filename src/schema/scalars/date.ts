import { GraphQLUpload } from 'graphql-upload'
import { Kind } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { asNexusMethod, scalarType } from 'nexus'

export const DateScalar = scalarType({
  name: 'DateTime',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value)
  },
  serialize(value) {
    return value.getTime()
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10)
    }
    return null
  }
})

export const JsonScalar = asNexusMethod(GraphQLJSON, 'json')
export const UploadScalar = asNexusMethod(GraphQLUpload, 'upload')
