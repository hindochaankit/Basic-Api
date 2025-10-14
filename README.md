# 🧩 ProjectApi – Full Stack .NET + jQuery AJAX CRUD App

A full-featured CRUD application built with **ASP.NET Core Web API**, **MongoDB**, and **jQuery AJAX**.  
Includes authentication (JWT-based), role-based access (Admin/Client), and full CRUD for Items and Contacts.

---

## 🚀 Features

✅ User Registration & Login (JWT Authentication)  
✅ Password validation (strong regex)  
✅ Admin panel with full rights  
✅ Client view restricted to own data  
✅ CRUD operations (Add, View, Update, Delete)  
✅ jQuery AJAX frontend for smooth UI  
✅ MongoDB integration  

---

## 🛠️ Tech Stack

- **Backend:** ASP.NET Core Web API  
- **Frontend:** HTML, CSS, jQuery AJAX  
- **Database:** MongoDB  
- **Auth:** JWT (JSON Web Token)  
- **Deployment Ready:** Configurable via `appsettings.json`

---
| Endpoint             | Method | Description       |
| -------------------- | ------ | ----------------- |
| `/api/auth/register` | POST   | Register new user |
| `/api/auth/login`    | POST   | User login        |
| `/api/items`         | GET    | Get all items     |
| `/api/items/{id}`    | PUT    | Update item       |
| `/api/items/{id}`    | DELETE | Delete item       |
| `/api/contacts`      | GET    | Get all contacts  |

👨‍💻 Author

Ankit Hindocha
🎓 BE IT | 💼 .NET Developer
🌐 LinkedIn : Ankit Hindocha
