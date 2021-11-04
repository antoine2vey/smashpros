import { RoleEnum } from "@prisma/client"
import { enumType, inputObjectType, objectType } from "nexus"
import { Role, User } from "nexus-prisma"

export const RoleObjectType = objectType({
  name: Role.$name,
  description: Role.$description,
  definition(t) {
    t.field(Role.id)
    t.field(Role.name)
  }
})

export const RoleEnumType = enumType({
  name: 'RoleEnum',
  members: RoleEnum
})

export const UserObjectType = objectType({
  name: User.$name,
  description: User.$description,
  definition: (t) => {
    t.field(User.id)
    t.field(User.characters)
    t.field(User.tag)
    t.field(User.profile_picture)
    t.field(User.roles)
    t.field(User.tournaments)
    t.field(User.tournaments_organizer)
    t.field(User.crew)
    t.field(User.email)
    t.field(User.waiting_crew)
    t.field(User.in_tournament)
  }
})

export const UserRegisterPayload = inputObjectType({
  name: 'UserRegisterPayload',
  definition(t) {
    t.nonNull.string('email')
    t.nonNull.string('password')
    t.nonNull.string('tag')
    t.nonNull.upload('profilePicture')
    t.nonNull.list.nonNull.id('characters')
    t.string('twitterUsername')
    t.string('twitchUsername')
    t.string('smashGGProfile')
  }
})

export const UserUpdatePayload = inputObjectType({
  name: 'UserUpdatePayload',
  definition(t) {
    t.nonNull.string('email')
    t.nonNull.string('tag')
    t.nonNull.string('password')
    t.nonNull.list.nonNull.id('characters')
    t.string('twitterUsername')
    t.string('twitchUsername')
    t.string('smashGGProfile')
    t.upload('profilePicture')
  }
})

export const RegisterPayload = inputObjectType({
  name: 'RegisterPayload',
  definition(t) {
    t.boolean('success')
  }
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
  }
})