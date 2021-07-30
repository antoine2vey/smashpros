import Joi from "joi"

export const registerSchema = Joi.object({
  password: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  tag: Joi.string().required(),
  profilePicture: Joi.any().required(),
  characters: Joi.array().required()
})

export const forgotPasswordSchema = Joi.object({
  code: Joi.string().required(),
  password: Joi.string().min(4).required(),
  confirm_password: Joi.any().equal(Joi.ref('password')).required()
})

export const emailSchema = Joi.string().email()