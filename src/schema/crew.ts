import { objectType } from "nexus";
import { Crew } from 'nexus-prisma'

export const CrewObjectType = objectType({
  name: Crew.$name,
  description: Crew.$description,
  definition: (t) => {
    t.field(Crew.id)
    t.field(Crew.name)
    t.field(Crew.members)
    t.field(Crew.prefix)
    t.field(Crew.waiting_members)
  }
})