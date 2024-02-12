import Joi from "joi";

export const contactSchema = Joi.object({
  name: Joi.string()
      .regex(/^[a-zA-Z]+$/)
      .required()
      .messages({
          "string.pattern.base": "Name should only contain letters.",
          "any.required": "Name is required.",
      }),
  email: Joi.string().email().required().messages({
      "string.email": "Invalid email format.",
      "any.required": "Email is required.",
  }),
  phone: Joi.string().regex(/^\d+$/).required().messages({
      "string.pattern.base": "Phone should only contain digits.",
      "any.required": "Phone is required.",
  }),
  favorite: Joi.boolean().required().messages({
      "any.required": "favorite is required",
  }),
});

export const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
      "any.required": "favorite is required",
  }),
});