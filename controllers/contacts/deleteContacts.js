const { removeContact } = require('../../models/contacts')
async function deleteContacts(req, res, next){
    try {
        const contactId = req.params.contactId;
        const contactRemoved = await removeContact(contactId);
    
        if (contactRemoved) {
          return res.status(200).json({ message: "Contact deleted" });
        }
    
       return res.status(404).json({ message: "Not found" });
      } catch (err) {
        next(err);
      }
}
module.exports = deleteContacts;