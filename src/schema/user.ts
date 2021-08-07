import { inputObjectType, objectType } from "nexus"
import { User } from "nexus-prisma"

export const UserObjectType = objectType({
  name: User.$name,
  description: User.$description,
  definition: (t) => {
    t.field(User.id)
    t.field(User.tag)
    t.field(User.profile_picture)
    t.field(User.characters)
  }
})

export const UserRegisterPayload = inputObjectType({
  name: 'UserRegisterPayload',
  definition(t) {
    t.string('email')
    t.string('password')
    t.string('tag')
    t.upload('profilePicture')
    t.list.nonNull.id('characters')
  }
})

export const UserUpdatePayload = inputObjectType({
  name: 'UserUpdatePayload',
  definition(t) {
    t.string('id')
    t.string('email')
    t.string('tag')
    t.upload('profilePicture')
    t.list.nonNull.id('characters')
  }
})
