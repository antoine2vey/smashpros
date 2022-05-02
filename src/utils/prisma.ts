import { Prisma } from '@prisma/client'
import { connectionPlugin } from 'nexus'

type PaginationArgs = {
  after?: string
  before?: string
  first?: number
  last?: number
}

export function mapIdsToPrisma(ids: string[]) {
  return ids.map((id) => ({ id }))
}

export function getCursorForArgs(
  field: string,
  { after, before, first, last }: PaginationArgs
) {
  let cursor: { [x: string]: number }
  const hasCursor = !!after || !!before
  const skip = hasCursor ? 1 : 0
  const take = first

  if (after) {
    cursor = {
      [field]: +connectionPlugin.base64Decode(after)
    }
  } else if (before) {
    cursor = {
      [field]: +connectionPlugin.base64Decode(before)
    }
  }

  return {
    skip,
    take,
    cursor
  }
}

export function getCursorForStringArgs(
  field: string,
  { after, before, first, last }: PaginationArgs
) {
  let cursor: { [x: string]: string }
  const hasCursor = !!after || !!before
  const skip = hasCursor ? 1 : 0
  const take = first

  if (after) {
    cursor = {
      [field]: connectionPlugin.base64Decode(after)
    }
  } else if (before) {
    cursor = {
      [field]: connectionPlugin.base64Decode(before)
    }
  }

  return {
    skip,
    take,
    cursor
  }
}

export function getCharacterQuery(characters: string[] | undefined) {
  if (!characters || characters.length === 0) {
    return undefined
  }

  return {
    some: {
      OR: characters.map((id) => ({ id }))
    }
  }
}

export function getTournamentQuery(tournament: string | undefined) {
  if (!tournament) {
    return undefined
  }

  return {
    some: {
      id: tournament
    }
  }
}

export function getTagQuery(tag: string | undefined): Prisma.StringFilter {
  if (!tag) {
    return undefined
  }

  return {
    contains: tag,
    mode: 'insensitive'
  }
}