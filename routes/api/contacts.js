const express = require("express");
const router = express.Router();
const contacts = require("../../models/contacts");
const nanoid = require("nanoid");
const Joi = require("joi");

const indexContacts = require('../../controllers/contacts/indexContacts');
const showContact = require('../../controllers/contacts/showContact');


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

router.get("/", indexContacts);

router.get("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contactById = await contacts.getContactById(contactId);

    if (!contactById) {
     return res.status(404).json({ message: "Not found" });
    }

   return res.json({ contact: contactById });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
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
    await contacts.addContact({ id, name, email, phone });
    return res.status(201).json({ id, name, email, phone });
  } catch (err) {
    next(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contactRemoved = await contacts.removeContact(contactId);

    if (contactRemoved) {
      return res.status(200).json({ message: "Contact deleted" });
    }

   return res.status(404).json({ message: "Not found" });
  } catch (err) {
    next(err);
  }
});

router.put("/:contactId", async (req, res, next) => {
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

    const updatedContact = await contacts.updateContact(contactId, body);
    if (updatedContact) {
      return res.status(200).json(updatedContact);
    } else {
      return res.status(404).json({ message: "Not found" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
