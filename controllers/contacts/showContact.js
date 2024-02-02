const { getContactById } = require('../../models/contacts')
async function showContact(req, res, next){
    try {
        const contactId = req.params.contactId;
        const contactById = await contacts.getContactById(contactId);
    
        if (!contactById) {
         return res.status(404).json({ message: "Not found" });
        }
    
        return res.json({ contact: contactById });
      } catch (err) {
        next(err);
      }
}    
module.exports = showContact;