using MongoDB.Driver;
using ProjectApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;

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
        public int GetItemsAddedToday() => _items.Find(i => i.CreatedAt.Date == DateTime.UtcNow.Date).ToList().Count;
        public int GetItemsAddedThisMonth() => _items.Find(i => i.CreatedAt.Month == DateTime.UtcNow.Month && i.CreatedAt.Year == DateTime.UtcNow.Year).ToList().Count;
        public int GetItemsAddedThisYear() => _items.Find(i => i.CreatedAt.Year == DateTime.UtcNow.Year).ToList().Count;
    }
}
