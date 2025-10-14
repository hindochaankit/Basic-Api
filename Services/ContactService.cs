using MongoDB.Driver;
using ProjectApi.Models;
using System;
using System.Collections.Generic;

namespace ProjectApi.Services
{
    public class ContactService
    {
        private readonly IMongoCollection<Contact> _contacts;

        public ContactService(IMongoDatabase database)
        {
            _contacts = database.GetCollection<Contact>("Contacts");
        }

        public List<Contact> Get() =>
            _contacts.Find(c => true).ToList();

        public Contact Create(Contact contact)
        {
            var existingContact = _contacts.Find(c => c.Phone == contact.Phone).FirstOrDefault();
            if (existingContact != null)
            {
                throw new Exception("Contact with this phone number already exists.");
            }

            _contacts.InsertOne(contact);
            return contact;
        }

        public Contact Update(string id, Contact updatedContact)
        {
            var contact = _contacts.Find(c => c.Id == id).FirstOrDefault();
            if (contact == null) return new Contact();

            var duplicate = _contacts.Find(c => c.Phone == updatedContact.Phone && c.Id != id).FirstOrDefault();
            if (duplicate != null)
            {
                throw new Exception("Another contact with this phone number already exists.");
            }

            contact.Name = updatedContact.Name;
            contact.Phone = updatedContact.Phone;

            _contacts.ReplaceOne(c => c.Id == id, contact);
            return contact;
        }

        public void Delete(string id) =>
            _contacts.DeleteOne(c => c.Id == id);
    }
}