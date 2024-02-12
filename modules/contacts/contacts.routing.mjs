import express from "express";
const router = express.Router();
import * as ctrlContact from './contacts.controller.mjs';

router.get("/", ctrlContact.get);
router.get("/:contactId", ctrlContact.getById);
router.post("/", ctrlContact.create);
router.delete("/:contactId", ctrlContact.remove);
router.put("/:contactId", ctrlContact.update);
router.patch("/:contactId/favorite", ctrlContact.updateStatus)

export default router;
