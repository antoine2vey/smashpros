import { GraphQLClient } from 'graphql-request'

export default new GraphQLClient('https://api.smash.gg/gql/alpha', {
  headers: {
    authorization: 'Bearer ' + process.env.SMASHGG_API_KEY
  }
})
