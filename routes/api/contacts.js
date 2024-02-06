const express = require("express");
const router = express.Router();
const ctrlContact = require('../../controllers/contacts')

router.get("/", ctrlContact.get);

router.get("/:contactId", ctrlContact.getById);

router.post("/", ctrlContact.create);

router.delete("/:contactId", ctrlContact.remove);

router.put("/:contactId", ctrlContact.update);

router.patch("/:contactId/favorite", ctrlContact.updateStatus)

module.exports =  router;