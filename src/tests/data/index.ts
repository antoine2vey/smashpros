import { Character, Crew, Role, User } from "@prisma/client";
import { UserCreateInput } from "../../typings/interfaces";

const profilePictureUri = '://profile_picture'
const iconPictureUri = '://icon'
const bannerPictureUri = '://banner'

const crew = {
  id: '1',
  name: 'Mappa',
  prefix: 'MPA',
  icon: iconPictureUri,
  banner: bannerPictureUri
}

const user = {
  profilePicture: profilePictureUri,
  prefix: 'SPROS',
  password: 'p4ssw0rd',
  email: 'user@smashpros.com',
  tag: 'user'
}