const express = require("express");
const router = express.Router();

const indexContacts = require('../../controllers/contacts/indexContacts');
const showContact = require('../../controllers/contacts/showContact');
const deleteContacts = require('../../controllers/contacts/deleteContacts');
const updateContacts = require('../../controllers/contacts/updateContacts');
const createContacts = require('../../controllers/contacts/createContacts');

router.get("/", indexContacts);

router.get("/:contactId", showContact);

router.post("/", createContacts);

router.delete("/:contactId", deleteContacts);

router.put("/:contactId", updateContacts);

module.exports =  router;