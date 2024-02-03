const Contact = require('./schemas/contacts')

const createContact = ({name, email, phone}) => {
    return Contact.create({name, email, phone})
}

module.exports = {
    createContact,
  }
  