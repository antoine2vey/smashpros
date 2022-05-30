import { Zone } from '../mongo'
import { QueryArg } from '../typings/interfaces'

export const zones: QueryArg<'zones'> = async (_, { countryCode }) => {
  return Zone.find({ country_code: countryCode }).sort('name')
}
