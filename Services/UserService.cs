using MongoDB.Driver;
using ProjectApi.Models;

namespace ProjectApi.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IConfiguration config)
        {
            var client = new MongoClient(config["MongoDB:ConnectionString"]);
            var database = client.GetDatabase(config["MongoDB:DatabaseName"]);
            _users = database.GetCollection<User>("Users");
        }

        public User? GetByUsername(string username) =>
            _users.Find(u => u.Username == username).FirstOrDefault();

        public void Create(User user) => _users.InsertOne(user);
    }
}
