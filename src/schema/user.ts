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
  }
})

export const UserUpdatePayload = inputObjectType({
  name: 'UserUpdatePayload',
  definition(t) {
    t.nonNull.string('email')
    t.nonNull.string('tag')
    t.nonNull.string('password')
    t.nonNull.upload('profilePicture')
    t.nonNull.list.nonNull.id('characters')
  }
})

export const RegisterPayload = objectType({
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