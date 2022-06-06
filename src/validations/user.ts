import Joi from 'joi'
import { UserUpdateInput } from '../typings/interfaces'

export const smashGGSlug = Joi.string()
  .length(8)
  .message('Invalid SmashGG id length')

export const registerSchema = Joi.object({
  password: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  tag: Joi.string().required(),
  profilePicture: Joi.any().required(),
  characters: Joi.array().required(),
  twitterUsername: Joi.string(),
  twitchUsername: Joi.string(),
  smashGGSlug: smashGGSlug.allow(null),
  smashGGUserId: Joi.number().allow(null),
  smashGGPlayerId: Joi.number().allow(null)
})

export const forgotPasswordSchema = Joi.object({
  code: Joi.string().required(),
  password: Joi.string().min(4).required(),
  confirmPassword: Joi.any().equal(Joi.ref('password')).required()
})

export const emailSchema = Joi.string().email()

export const updateSchema = Joi.object<UserUpdateInput>({
  tag: Joi.string(),
  notificationToken: Joi.string(),
  profilePicture: Joi.any(),
  characters: Joi.array().items(Joi.string()),
  smashGGSlug: smashGGSlug,
  smashGGUserId: Joi.number(),
  smashGGPlayerId: Joi.number(),
  allowNotifications: Joi.bool(),
  allowSearchability: Joi.bool()
})
