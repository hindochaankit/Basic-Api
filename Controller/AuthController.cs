using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ProjectApi.Models;
using System.Text.RegularExpressions;


namespace ProjectApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMongoCollection<User> _users;

        public AuthController(IMongoDatabase database)
        {
            _users = database.GetCollection<User>("Users");
        }

         [HttpPost("register")]
        public IActionResult Register(User user)
        {
            if (string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
                return BadRequest("Username and password are required.");

            string pattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$";
            if (!Regex.IsMatch(user.Password, pattern))
            {
                return UnprocessableEntity("Password must be at least 10 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
            }

            var existingUser = _users.Find(u => u.Username == user.Username).FirstOrDefault();
            if (existingUser != null)
                return Conflict("Username already exists.");

            _users.InsertOne(user);
            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("login")]
        public IActionResult Login(User user)
        {
            try
            {
                var existingUser = _users.Find(u => u.Username == user.Username && u.Password == user.Password).FirstOrDefault();
                if (existingUser == null)
                    return Unauthorized("Invalid username or password");

                return Ok(new { message = "Login successful" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
