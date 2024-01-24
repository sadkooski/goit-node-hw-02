const fs = require("fs/promises");
const path = require("node:path");

const contactsPath = path.join(process.cwd(), "models", "contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath);
    // console.log("1 JSON", JSON.parse(contacts));
    // console.log("1 String", contacts.toString());
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

const removeContact = async (contactId) => {};

const addContact = async (body) => {
  try {
    const { id, name, email, phone } = body;
    let contactExists = false;
    const unparsedContacts = await fs.readFile(contactsPath);
    const contacts = JSON.parse(unparsedContacts);

    contacts.forEach((contact) => {
      if (
        contact.id === id &&
        contact.name === name &&
        contact.email === email &&
        contact.phone === phone
      ) {
        contactExists = true;
        return console.log("Contact exists");
      }
      if (!contactExists) {
        const newContact = {
          id: id,
          name: name,
          email: email,
          phone: phone,
        };
        contacts.push(newContact);
        const updatedContacts = JSON.stringify(contacts);
        console.log("after add", updatedContacts);
        return fs.writeFile(contactsPath, updatedContacts);
      }
    });
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
