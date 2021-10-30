import { enumType, inputObjectType, objectType } from "nexus";
import { Crew } from 'nexus-prisma'
import { CrewUpdateAction } from "../typings/enums";

export const CrewObjectType = objectType({
  name: Crew.$name,
  description: Crew.$description,
  definition: (t) => {
    t.field(Crew.id)
    t.field(Crew.name)
    t.field(Crew.members)
    t.field(Crew.prefix)
    t.field(Crew.waiting_members)
    t.field(Crew.banner)
    t.field(Crew.icon)
  }
})

export const CrewUpdateActionEnum = enumType({
  name: 'CrewUpdateActionEnum',
  members: [CrewUpdateAction.ACCEPT, CrewUpdateAction.DENY]
})

export const CrewCreationPayload = inputObjectType({
  name: 'CrewCreationPayload',
  definition(t) {
    t.nonNull.string('name')
    t.nonNull.string('prefix')
    t.nonNull.upload('banner')
    t.nonNull.upload('icon')
  }
})