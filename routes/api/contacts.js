const express = require("express");
const router = express.Router();

const indexContacts = require('../../controllers/contacts');
const showContact = require('../../controllers/contacts');
const deleteContacts = require('../../controllers/contacts');
const updateContacts = require('../../controllers/contacts');
const createContacts = require('../../controllers/contacts');
const updateStatusContacts = require('../../controllers/contacts')

router.get("/", indexContacts);

router.get("/:contactId", showContact);

router.post("/", createContacts);

router.delete("/:contactId", deleteContacts);

router.put("/:contactId", updateContacts);

router.patch("/:contactId/favorite", updateStatusContacts)

module.exports =  router;