namespace ProjectApi.Models
{
    public class MongoDBSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
        public string ItemsCollectionName { get; set; } = string.Empty;
        public string ContactsCollectionName { get; set; } = string.Empty;
    }
}
