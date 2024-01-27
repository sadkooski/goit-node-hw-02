const fs = require("fs/promises");
const path = require("node:path");

const contactsPath = path.join(process.cwd(), "models", "contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await fs.readFile(contactsPath);
    const contactById = JSON.parse(contacts).find(
      (contact) => contact.id === contactId
    );
    return contactById;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const addContact = async (body) => {
  try {
    const { id, name, email, phone } = body;
    const unparsedContacts = await fs.readFile(contactsPath);
    const contacts = JSON.parse(unparsedContacts);
    const contactExists = contacts.some(
      (contact) =>
        contact.name === name &&
        contact.email === email &&
        contact.phone === phone
    );

    if (contactExists) {
      console.log("Contact already exists");
      return;
    }

    const newContact = {
      id: id,
      name: name,
      email: email,
      phone: phone,
    };

    contacts.push(newContact);
    const updatedContacts = JSON.stringify(contacts, null, 2);

    await fs.writeFile(contactsPath, updatedContacts);
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const removeContact = async (contactId) => {
  try {
    const unparsedContacts = await fs.readFile(contactsPath);
    const contacts = JSON.parse(unparsedContacts);
    const indexToRemove = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (indexToRemove !== -1) {
      contacts.splice(indexToRemove, 1);
      const updatedContacts = JSON.stringify(contacts);
      await fs.writeFile(contactsPath, updatedContacts);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const unparsedContacts = await fs.readFile(contactsPath);
    const contacts = JSON.parse(unparsedContacts);
    const indexToUpdate = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    const contactById = contacts.find((contact) => contact.id === contactId);

    const updatedContact = {
      id: contactId,
      name: body.name !== undefined ? body.name : contactById.name,
      email: body.email !== undefined ? body.email : contactById.email,
      phone: body.phone !== undefined ? body.phone : contactById.phone,
    };

    if (indexToUpdate !== -1) {
      contacts.splice(indexToUpdate, 1, updatedContact);
      const updatedContacts = JSON.stringify(contacts);
      await fs.writeFile(contactsPath, updatedContacts);
      return updatedContact;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
