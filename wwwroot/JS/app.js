const API_BASE = "http://localhost:5193/api";
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
      showToast(msg, "error");
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
  if (!username || !password) return showToast("Please fill all fields!", "error");

  apiRequest({
    endpoint: "/auth/login",
    method: "POST",
    data: { username, password },
    success: (data) => {
      jwtToken = data.token;
      alert("Login successful!");
      showToast("Login successful!");
      showDashboard();
    },
  });
}

function register() {
  const username = $("#regUsername").val().trim();
  const password = $("#regPassword").val().trim();
  if (!username || !password) return showToast("Please fill all fields!", "error");

  apiRequest({
    endpoint: "/auth/register",
    method: "POST",
    data: { username, password },
    success: () => {
      showToast("Registration successful! Please login.");
      showLogin();
    },
  });
}

function logout() {
  jwtToken = "";
  alert("Logged out successfully!");
  showToast("Logged out successfully!");
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

function filterItems() {
  const query = $("#searchItem").val().toLowerCase();
  $("#itemsList li").each(function () {
    const text = $(this).text().toLowerCase();
    $(this).toggle(text.includes(query));
  });
}

function filterContacts() {
  const query = $("#searchContact").val().toLowerCase();
  $("#contactsList li").each(function () {
    const text = $(this).text().toLowerCase();
    $(this).toggle(text.includes(query));
  });
}

function exportItems() {
  const data = [];
  $("#itemsList li").each(function () {
    const text = $(this).clone().children().remove().end().text().trim();
    const parts = text.split(" - ");
    data.push({ Name: parts[0], Description: parts[1] || "" });
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Items");
  XLSX.writeFile(wb, "Items.xlsx");
}

function exportContacts() {
  const data = [];
  $("#contactsList li").each(function () {
    const text = $(this).clone().children().remove().end().text().trim();
    const parts = text.split(" - ");
    data.push({ Name: parts[0], Phone: parts[1] || "" });
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Contacts");
  XLSX.writeFile(wb, "Contacts.xlsx");
}

function showToast(message, type = "success") {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: type,
    title: message,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
}

showToast("Item added successfully!");
showToast("Error deleting item!", "error");

function deleteItem(id) {
  apiRequest({
    endpoint: `/items/${id}`,
    method: "DELETE",
    success: function () {
      showToast("Item deleted!", "success");
      viewItems();
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
  if (!name || !description) return showToast("Please fill all fields!", "error");

  apiRequest({
    endpoint: "/items",
    success: (items) => {
      if (items.some((i) => i.name.toLowerCase() === name.toLowerCase()))
        return showToast("Item already exists!");
      apiRequest({
        endpoint: "/items",
        method: "POST",
        data: { name, description },
        success: () => {
          showToast("Item added successfully!");
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
  if (!name || !description) return showToast("Please fill all fields!", "error");

  apiRequest({
    endpoint: `/items/${id}`,
    method: "PUT",
    data: { name, description },
    success: () => {
      showToast("Item updated!");
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
      showToast("Item deleted!", "success");
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
  if (!name || !phone) return showToast("Please fill all fields!", "error");
  if (!/^[6-9]\d{9}$/.test(phone)) return showToast("Invalid phone number!", "error");

  apiRequest({
    endpoint: "/contacts",
    success: (contacts) => {
      if (contacts.some((c) => c.phone === phone))
        return showToast("Contact exists!", "error");
      apiRequest({
        endpoint: "/contacts",
        method: "POST",
        data: { name, phone },
        success: () => {
          showToast("Contact added!");
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
      showToast("Contact deleted!", "success");
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
  if (!name || !phone) return showToast("Please fill all fields!", "error");
  if (!/^[6-9]\d{9}$/.test(phone)) return showToast("Invalid phone!", "error");

  apiRequest({
    endpoint: `/contacts/${id}`,
    method: "PUT",
    data: { name, phone },
    success: () => {
      showToast("Contact updated!");
      closePopup("updateContactPopup");
      viewContacts();
    },
  });
}
