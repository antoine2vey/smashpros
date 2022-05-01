import { Redis } from 'ioredis'
import { cache } from '../redis'

class RedisNamingStrategy {
  private cache: Redis = cache
  private readonly delimiter = '.'

  user(id: string) {
    const key = 'user'
    return key + this.delimiter + id
  }
}

export default new RedisNamingStrategy()
