import Contact from './contact.schema.mjs';

export function getAllContacts(){
    return Contact.find()
}

export function getContactById(id){
    return Contact.findOne({_id: id})
}

export function createContact({name, email, phone}){
    return Contact.create({name, email, phone})
}

export function deleteContact(id){
    return Contact.findByIdAndDelete({_id: id})
}

export function updateContact(id, body){
    return Contact.findByIdAndUpdate({_id: id}, body, {new: true})
}

export function updateContactStatus(id, favorite){
    return Contact.findByIdAndUpdate({_id: id}, favorite, {new: true})
}

