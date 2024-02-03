const {  listContacts } = require('../../models/contacts')
const { Contact } = require('../../service/schemas/contacts')

async function indexContacts(req, res, next){
    try {
        const contacts = await listContacts();
       return res.status(200).json({
          contacts,
        });
      } catch (err) {
       return res.status(500).json(`An error occurred: ${err}`);
      }
    }
    module.exports = indexContacts;