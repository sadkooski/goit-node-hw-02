const { addContact } = require('../../models/contacts')
const nanoid = require("nanoid");
const Joi = require("joi");

const contactSchema = Joi.object({
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
  });

async function createContacts(req, res, next){
    try {
        const { name, email, phone } = req.body;
    
        if (!name || !email || !phone) {
          return res.status(400).json({ message: "missing required name - field" });
        }
    
        const { error } = contactSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }
    
        const id = nanoid();
        await addContact({ id, name, email, phone });
        return res.status(201).json({ id, name, email, phone });
      } catch (err) {
        next(err);
      }
}
module.exports = createContacts;