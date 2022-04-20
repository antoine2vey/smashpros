import { RedisPubSub } from 'graphql-redis-subscriptions'
import Redis from 'ioredis';

const options = {
  host: '127.0.0.1',
  port: 6379
}

const cacheKeys = {
  refreshTokens: 'tokens:refresh'
}

const cache = new Redis(options)

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
})

export {
  pubsub,
  cache,
  cacheKeys
}