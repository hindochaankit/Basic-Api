using MongoDB.Driver;
using ProjectApi.Models;
using System.Collections.Generic;

namespace ProjectApi.Services
{
    public class ItemService
    {
        private readonly IMongoCollection<Item> _items;

        public ItemService(IMongoDatabase database)
        {
            _items = database.GetCollection<Item>("Items");
        }

        public List<Item> Get()
        {
            try
            {
                return _items.Find(item => true).ToList();
            }
            catch (System.Exception ex)
            {
                throw new System.Exception("Error fetching items: " + ex.Message);
            }
        }

        public Item Create(Item item)
        {
            _items.InsertOne(item);
            return item;
        }

        public Item Update(string id, Item updatedItem)
        {
            var item = _items.Find(i => i.Id == id).FirstOrDefault();
            if (item == null) return new Item();

            item.Name = updatedItem.Name;
            item.Description = updatedItem.Description;

            _items.ReplaceOne(i => i.Id == id, item);
            return item;
        }

        public void Delete(string id) =>
            _items.DeleteOne(i => i.Id == id);
    }
}