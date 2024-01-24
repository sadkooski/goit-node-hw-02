const express = require("express");
const router = express.Router();
const contacts = require("../../models/contacts");
const nanoid = require("nanoid");

router.get("/", async (req, res, next) => {
  try {
    const allContacts = await contacts.listContacts();
    console.log("2", allContacts);
    // res.json({ contacts: allContacts });
    res.render("index", { contacts: allContacts });
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contactById = await contacts.getContactById(contactId);
    if (!contactById) {
      res.status(404).json({ message: "Not found" });
    }
    res.json({ contact: contactById });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    console.log("12345", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      res.status(400).json({ message: "missing required name - field" });
    } else {
      const id = nanoid();
      await contacts.addContact({ id, name, email, phone });
      res.status(201).json({ id, name, email, phone });
    }
  } catch (err) {
    next(err);
  }

  res.json({ message: "template message" });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
