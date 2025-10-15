const API_BASE = "http://localhost:xxxx/api";
let jwtToken = "";

$(document).ready(() => {
  $("#loginContainer").show();
});

function apiRequest({ endpoint, method = "GET", data = null, success }) {
  $.ajax({
    url: API_BASE + endpoint,
    method,
    headers: jwtToken ? { Authorization: "Bearer " + jwtToken } : {},
    contentType: "application/json",
    data: data ? JSON.stringify(data) : null,
    success,
    error: (xhr) => {
      let msg = "Error: ";
      try {
        const res = JSON.parse(xhr.responseText);
        msg += res.message || res.error || xhr.statusText;
      } catch {
        msg += xhr.responseText || xhr.statusText;
      }
      alert(msg);
    },
  });
}

function showRegister() {
  $("#loginContainer").hide();
  $("#registerContainer").show();
}

function showLogin() {
  $("#registerContainer").hide();
  $("#loginContainer").show();
}

function showDashboard() {
  $("#loginContainer, #registerContainer").hide();
  $("#dashboardContainer").show();

  const username = $("#username").val() || $("#regUsername").val();
  $("#welcomeMsg").text(`Welcome, ${username}!`);

  updateStats();
}

function login() {
  const username = $("#username").val().trim();
  const password = $("#password").val().trim();
  if (!username || !password) return alert("Please fill all fields!");

  apiRequest({
    endpoint: "/auth/login",
    method: "POST",
    data: { username, password },
    success: (data) => {
      jwtToken = data.token;
      alert("Login successful!");
      showDashboard();
    },
  });
}

function register() {
  const username = $("#regUsername").val().trim();
  const password = $("#regPassword").val().trim();
  if (!username || !password) return alert("Please fill all fields!");

  apiRequest({
    endpoint: "/auth/register",
    method: "POST",
    data: { username, password },
    success: () => {
      alert("Registration successful! Please login.");
      showLogin();
    },
  });
}

function logout() {
  jwtToken = "";
  alert("Logged out successfully!");
  $("#dashboardContainer").hide();
  $("#loginContainer").show();
}

function showPopup(id) {
  $("#" + id).css("display", "flex");
}
function closePopup(id) {
  $("#" + id).hide();
}

function updateStats() {
  apiRequest({
    endpoint: "/items",
    success: (items) => {
      $("#totalItems").text(items.length);
    },
  });

  apiRequest({
    endpoint: "/contacts",
    success: (contacts) => {
      $("#totalContacts").text(contacts.length);
    },
  });
}

function showReport(type) {
  apiRequest({
    endpoint: `/reports/${type}`,
    success: (data) => {
      const html = `
        <p><strong>${
          type.charAt(0).toUpperCase() + type.slice(1)
        } Report</strong></p>
        <p>Items Added: ${data.itemsAdded}</p>
        <p>Contacts Added: ${data.contactsAdded}</p>
      `;
      $("#reportsContent").html(html);
      showPopup("reportsPopup");
    },
  });
}

function viewItems() {
  apiRequest({
    endpoint: "/items",
    success: (items) => {
      const list = $("#itemsList").empty();
      if (!items.length) return list.html("<li>No items found</li>");
      items.forEach((item) => {
        list.append(`<li>${item.name} - ${item.description}
          <br>
          <button id="button1" onclick="showUpdateItemPopup('${item.id}','${item.name}','${item.description}')">Update</button>
          <button id="button1" onclick="deleteItem('${item.id}')">Delete</button>
        </li>`);
      });
    },
  });
}

function addItem() {
  const name = $("#itemName").val().trim();
  const description = $("#itemDesc").val().trim();
  if (!name || !description) return alert("Please fill all fields!");

  apiRequest({
    endpoint: "/items",
    success: (items) => {
      if (items.some((i) => i.name.toLowerCase() === name.toLowerCase()))
        return alert("Item already exists!");
      apiRequest({
        endpoint: "/items",
        method: "POST",
        data: { name, description },
        success: () => {
          alert("Item added successfully!");
          $("#itemName, #itemDesc").val("");
          closePopup("addItemPopup");
          viewItems();
          updateStats();
        },
      });
    },
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
  const id = $("#updateItemId").val();
  const name = $("#updateItemName").val().trim();
  const description = $("#updateItemDesc").val().trim();
  if (!name || !description) return alert("Please fill all fields!");

  apiRequest({
    endpoint: `/items/${id}`,
    method: "PUT",
    data: { name, description },
    success: () => {
      alert("Item updated!");
      closePopup("updateItemPopup");
      viewItems();
    },
  });
}

function deleteItem(id) {
  if (!confirm("Are you sure?")) return;
  apiRequest({
    endpoint: `/items/${id}`,
    method: "DELETE",
    success: () => {
      alert("Item deleted!");
      viewItems();
      closePopup("viewItemsPopup");
      updateStats();
    },
  });
}

function viewContacts() {
  apiRequest({
    endpoint: "/contacts",
    success: (contacts) => {
      const list = $("#contactsList").empty();
      if (!contacts.length) return list.html("<li>No contacts found</li>");
      contacts.forEach((c) => {
        list.append(`<li>${c.name} - ${c.phone}
          <br>
          <button id="button1" onclick="showUpdateContactPopup('${c.id}','${c.name}','${c.phone}')">Update</button>
          <button id="button1" onclick="deleteContact('${c.id}')">Delete</button>
        </li>`);
      });
    },
  });
}

function addContact() {
  const name = $("#contactName").val().trim();
  const phone = $("#contactPhone").val().trim();
  if (!name || !phone) return alert("Please fill all fields!");
  if (!/^[6-9]\d{9}$/.test(phone)) return alert("Invalid phone number!");

  apiRequest({
    endpoint: "/contacts",
    success: (contacts) => {
      if (contacts.some((c) => c.phone === phone))
        return alert("Contact exists!");
      apiRequest({
        endpoint: "/contacts",
        method: "POST",
        data: { name, phone },
        success: () => {
          alert("Contact added!");
          $("#contactName, #contactPhone").val("");
          closePopup("addContactPopup");
          viewContacts();
          updateStats();
        },
      });
    },
  });
}

function deleteContact(id) {
  if (!confirm("Are you sure?")) return;
  apiRequest({
    endpoint: `/contacts/${id}`,
    method: "DELETE",
    success: () => {
      alert("Contact deleted!");
      viewContacts();
      closePopup("viewContactsPopup");
      updateStats();
    },
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
  const id = $("#updateContactId").val();
  const name = $("#updateContactName").val().trim();
  const phone = $("#updateContactPhone").val().trim();
  if (!name || !phone) return alert("Please fill all fields!");
  if (!/^[6-9]\d{9}$/.test(phone)) return alert("Invalid phone!");

  apiRequest({
    endpoint: `/contacts/${id}`,
    method: "PUT",
    data: { name, phone },
    success: () => {
      alert("Contact updated!");
      closePopup("updateContactPopup");
      viewContacts();
    },
  });
}
