using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using ProjectApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// MongoDB connection
builder.Services.AddSingleton<IMongoClient>(s =>
{
    var config = s.GetRequiredService<IConfiguration>();
    var connectionString = config["MongoDB:ConnectionString"] 
        ?? throw new ArgumentNullException("connectionString");
    return new MongoClient(connectionString);
});

builder.Services.AddSingleton<IMongoDatabase>(s =>
{
    var config = s.GetRequiredService<IConfiguration>();
    var client = s.GetRequiredService<IMongoClient>();
    var dbName = config["MongoDB:DatabaseName"] 
        ?? throw new ArgumentNullException("DatabaseName");
    return client.GetDatabase(dbName);
});

// Register services
builder.Services.AddSingleton<ItemService>();
builder.Services.AddSingleton<ContactService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
