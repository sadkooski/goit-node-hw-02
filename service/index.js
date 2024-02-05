const Contact = require('./schemas/contacts')

function getAllContacts(){
    return Contact.find()
}

function getContactById(id){
    return Contact.findOne({_id: id})
}

function createContact({name, email, phone}){
    return Contact.create({name, email, phone})
}

function deleteContact(id){
    return Contact.findByIdAndDelete({_id: id})
}

function updateContact(id, body){
    return Contact.findByIdAndUpdate({_id: id}, body, {new: true})
}

function updateStatusContact(id, body){
    return Contact.findByIdAndUpdate({_id: id}, body, {new: true})
}

module.exports = {
    createContact,
    deleteContact,
    getAllContacts,
    getContactById,
    updateContact,
    updateStatusContact,
  }
  