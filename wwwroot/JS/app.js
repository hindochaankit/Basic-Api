const API_BASE = "http://localhost:xxxx/api";

let jwtToken = localStorage.getItem("jwtToken") || "";

function apiRequest({ endpoint, method = "GET", data = null, success }) {
  $.ajax({
    url: API_BASE + endpoint,
    method: method,
    headers: jwtToken ? { "Authorization": "Bearer " + jwtToken } : {},
    contentType: "application/json",
    data: data ? JSON.stringify(data) : null,
    success: success,
    error: function (xhr) {
      let msg = "Error: ";
      try {
        const res = JSON.parse(xhr.responseText);
        msg += res.message || res.error || xhr.statusText;
      } catch (e) {
        msg += xhr.responseText || xhr.statusText || xhr.status;
      }
      alert(msg);
    },
  });
}

function ensureLoggedIn() {
  if (!jwtToken) {
    alert("Please login first!");
    window.location.href = "index.html";
    return false;
  }
  return true;
}

function login() {
  const username = $("#username").val().trim();
  const password = $("#password").val().trim();
  if (!username || !password) { alert("Please fill all fields!"); return; }

  apiRequest({
    endpoint: "/auth/login",
    method: "POST",
    data: { username, password },
    success: function (data) {
      localStorage.setItem("jwtToken", data.token);
      jwtToken = data.token;
      alert("Login successful!");
      window.location.href = "dashboard.html";
    }
  });
}

function register() {
  const username = $("#regUsername").val().trim();
  const password = $("#regPassword").val().trim();
  if (!username || !password) { alert("Please fill all fields!"); return; }

  apiRequest({
    endpoint: "/auth/register",
    method: "POST",
    data: { username, password },
    success: function () {
      alert("Registration successful! Please login.");
      window.location.href = "index.html";
    }
  });
}

function logout() {
  localStorage.removeItem("jwtToken");
  jwtToken = "";
  window.location.href = "index.html";
  window.history.pushState(null, null, "index.html");
  window.onpopstate = function () {
    window.location.href = "index.html";
  };

  alert("Logged out successfully!");
}


function showPopup(id) { $("#" + id).css("display", "flex"); }
function closePopup(id) { $("#" + id).css("display", "none"); }

function viewItems() {
  if (!ensureLoggedIn()) return;

  apiRequest({
    endpoint: "/items",
    success: function (items) {
      const list = $("#itemsList");
      list.empty();
      if (!items || items.length === 0) list.html("<li>No items found</li>");
      else {
        items.forEach(item => {
          list.append(`
            <li>
              <span>${item.name} - ${item.description}</span>
              <button onclick="closePopup('viewItemsPopup');showUpdateItemPopup('${item.id}', '${item.name}', '${item.description}')">Update</button>
              <button onclick="deleteItem('${item.id}')">Delete</button>
            </li>
          `);
        });
      }
    }
  });
}

function addItem() {
  if (!ensureLoggedIn()) return;

  const name = $("#itemName").val().trim();
  const description = $("#itemDesc").val().trim();
  if (!name || !description) { alert("Please fill all fields!"); return; }

  apiRequest({
    endpoint: "/items",
    success: function (items) {
      if (items.some(i => i.name.toLowerCase() === name.toLowerCase())) {
        alert("Item with this name already exists.");
        return;
      }
      apiRequest({
        endpoint: "/items",
        method: "POST",
        data: { name, description },
        success: function () {
          alert("Item added successfully!");
          $("#itemName").val("");
          $("#itemDesc").val("");
          closePopup("addItemPopup");
          viewItems();
        }
      });
    }
  });
}

function deleteItem(id) {
  if (!ensureLoggedIn()) return;
  if (!confirm("Are you sure you want to delete this item?")) return;

  apiRequest({
    endpoint: `/items/${id}`,
    method: "DELETE",
    success: function () {
      alert("Item deleted successfully!");
      viewItems();
    }
  });
}

function showUpdateItemPopup(id, name, description) {
  closePopup("viewItemsPopup");
  $("#updateItemId").val(id);
  $("#updateItemName").val(name);
  $("#updateItemDesc").val(description);
  showPopup("updateItemPopup");
}

function updateItem() {
  if (!ensureLoggedIn()) return;

  const id = $("#updateItemId").val();
  const name = $("#updateItemName").val().trim();
  const description = $("#updateItemDesc").val().trim();
  if (!name || !description) { alert("Please fill all fields!"); return; }

  apiRequest({
    endpoint: `/items/${id}`,
    method: "PUT",
    data: { name, description },
    success: function () {
      alert("Item updated successfully!");
      closePopup("updateItemPopup");
      closePopup("viewItemsPopup");
      viewItems();
    }
  });
}

function viewContacts() {
  if (!ensureLoggedIn()) return;

  apiRequest({
    endpoint: "/contacts",
    success: function (contacts) {
      const list = $("#contactsList");
      list.empty();
      if (!contacts || contacts.length === 0) list.html("<li>No contacts found</li>");
      else {
        contacts.forEach(contact => {
          list.append(`
            <li>
              <span>${contact.name} - ${contact.phone}</span>
              <button onclick="showUpdateContactPopup('${contact.id}', '${contact.name}', '${contact.phone}')">Update</button>
              <button onclick="deleteContact('${contact.id}')">Delete</button>
            </li>
          `);
        });
      }
    }
  });
}

function addContact() {
  if (!ensureLoggedIn()) return;

  const name = $("#contactName").val().trim();
  const phone = $("#contactPhone").val().trim();
  if (!name || !phone) { alert("Please fill all fields!"); return; }
  if (!/^[6-9]\d{9}$/.test(phone)) { alert("Please enter a valid 10-digit Indian mobile number."); return; }

  apiRequest({
    endpoint: "/contacts",
    success: function (contacts) {
      if (contacts.some(c => c.phone === phone)) { alert("Contact with this phone already exists."); return; }

      apiRequest({
        endpoint: "/contacts",
        method: "POST",
        data: { name, phone },
        success: function () {
          alert("Contact added successfully!");
          $("#contactName").val("");
          $("#contactPhone").val("");
          closePopup("addContactPopup");
          viewContacts();
        }
      });
    }
  });
}

function deleteContact(id) {
  if (!ensureLoggedIn()) return;
  if (!confirm("Are you sure you want to delete this contact?")) return;

  apiRequest({
    endpoint: `/contacts/${id}`,
    method: "DELETE",
    success: function () {
      alert("Contact deleted successfully!");
      viewContacts();
    }
  });
}

function showUpdateContactPopup(id, name, phone) {
  closePopup("viewContactsPopup");
  $("#updateContactId").val(id);
  $("#updateContactName").val(name);
  $("#updateContactPhone").val(phone);
  showPopup("updateContactPopup");
}

function updateContact() {
  if (!ensureLoggedIn()) return;

  const id = $("#updateContactId").val();
  const name = $("#updateContactName").val().trim();
  const phone = $("#updateContactPhone").val().trim();
  if (!name || !phone) { alert("Please fill all fields!"); return; }
  if (!/^[6-9]\d{9}$/.test(phone)) { alert("Please enter a valid 10-digit Indian mobile number."); return; }

  apiRequest({
    endpoint: `/contacts/${id}`,
    method: "PUT",
    data: { name, phone },
    success: function () {
      alert("Contact updated successfully!");
      closePopup("updateContactPopup");
      closePopup("viewContactsPopup");
      viewContacts();
    }
  });
}