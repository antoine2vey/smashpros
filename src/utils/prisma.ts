import { Prisma } from "@prisma/client";
import { connectionPlugin } from "nexus";

type PaginationArgs = {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
}

export function mapIdsToPrisma(ids: string[]) {
  return ids.map(id => ({ id }))
}

export function getCursorForArgs(
  field: string,
  {
    after,
    before,
    first,
    last
  }: PaginationArgs
) {
  let cursor: {[x: string]: string}
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