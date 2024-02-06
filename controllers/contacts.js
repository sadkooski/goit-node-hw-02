const {contactSchema, favoriteSchema} = require('../service/validation')
const { createContact, deleteContact, getAllContacts, getContactById, updateContact, updateContactStatus } = require('../service/index')

async function get(req, res, next){
    try {
      const result = await getAllContacts();
      if (result) {
        return res.status(200).json({ message: "List od Contacts", result });
      }
      } catch (err) {
        next(err)
      }
    }

    async function getById(req, res, next){
        try {
            const contactId = req.params.contactId;
            const result = await getContactById(contactId);
            if (!result) {
             return res.status(404).json({ message: "Contact not found" });
            }
            return res.json({ contact: result });
          } catch (err) {
            next(err);
          }
    }    

    async function create(req, res, next){
        try {
            const { name, email, phone, favorite } = req.body;
        
            if (!name || !email || !phone || favorite === undefined) {
              return res.status(400).json({ message: "missing required name - field" });
            }
        
            const { error } = contactSchema.validate(req.body);
            if (error) {
              return res.status(400).json({ message: error.details[0].message });
            }
            const result = await createContact( { name, email, phone, favorite })
            result.save();
            console.log('Contact created', result);
            return res.json({data: result})
           
          } catch (err) {
            next(err);
          }
    }

    async function remove(req, res, next){
        try {
            const contactId = req.params.contactId;
            const result = await deleteContact(contactId);
        
            if (result) {
              return res.status(200).json({ message: "Contact deleted" });
            }
        
           return res.status(404).json({ message: "Not found" });
          } catch (err) {
            next(err);
          }
    }

    async function update(req, res, next){
        try {
            const contactId = req.params.contactId;
            const { name, email, phone, favorite } = req.body;
            const { error } = contactSchema.validate(req.body);
        
            if (error) {
              return res.status(400).json({ message: error.details[0].message });
            }
        
            const body = { name, email, phone, favorite };
            if (!body) {
              return res.status(400).json({ message: "Missing fields" });
            }
        
            const result = await updateContact(contactId, body);
            if (result) {
              return res.status(200).json(result);
            } else {
              return res.status(404).json({ message: "Not found" });
            }
          } catch (err) {
            next(err);
          }
    }

    async function updateStatus(req, res, next){
        try {
            const contactId = req.params.contactId;
            const favorite  = req.body;
            const { error } = favoriteSchema.validate(favorite);
    
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
              }
              
              if (!favorite) {
                return res.status(400).json({ message: "Missing field favorite" });
              }
    
              const result = await updateContactStatus(contactId, favorite);
              if (result) {
                return res.status(200).json(result);
              } else {
                return res.status(404).json({ message: "Not found" });
              }
        } catch (err) {
        next(err);
          }
     }

     module.exports = {    
      get,
      getById,
      create,
      remove,
      update,
      updateStatus,
    }