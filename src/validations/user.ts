import Joi from "joi"

export const smashGGSlug = Joi.string().length(8).message('Invalid SmashGG id length')

export const registerSchema = Joi.object({
  password: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  tag: Joi.string().required(),
  profilePicture: Joi.any().required(),
  characters: Joi.array().required(),
  twitterUsername: Joi.string(),
  twitchUsername: Joi.string(),
  smashGGProfile: smashGGSlug
})

export const forgotPasswordSchema = Joi.object({
  code: Joi.string().required(),
  password: Joi.string().min(4).required(),
  confirmPassword: Joi.any().equal(Joi.ref('password')).required()
})

export const emailSchema = Joi.string().email()