export function mapIdsToPrisma(ids: string[]) {
  return ids.map(id => ({ id }))
}