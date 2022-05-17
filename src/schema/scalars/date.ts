import { GraphQLUpload } from 'graphql-upload'
import GraphQLJSON from 'graphql-type-json'
import { asNexusMethod, scalarType } from 'nexus'
import { GraphQLDateTime } from 'graphql-iso-date'

export const DateScalar = asNexusMethod(GraphQLDateTime, 'date')
export const JsonScalar = asNexusMethod(GraphQLJSON, 'json')
export const UploadScalar = asNexusMethod(GraphQLUpload, 'upload')
