const { updateContact } = require('../../models/contacts');
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

async function updateContacts(req, res, next){
    try {
        const contactId = req.params.contactId;
        const { name, email, phone } = req.body;
        const { error } = contactSchema.validate(req.body);
    
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }
    
        const body = { name, email, phone };
        if (!body) {
          return res.status(400).json({ message: "Missing fields" });
        }
    
        const updatedContact = await updateContact(contactId, body);
        if (updatedContact) {
          return res.status(200).json(updatedContact);
        } else {
          return res.status(404).json({ message: "Not found" });
        }
      } catch (err) {
        next(err);
      }
}
module.exports = updateContacts;