// FP.js

let chemicals = JSON.parse(localStorage.getItem("chemicals")) || [];

// Helper: Convert quantity to a base unit for comparison
function convertToBaseUnit(quantity, unit) {
  const unitConversion = {
    "ml": 1,
    "litre": 1000,
    "g": 1,
    "kg": 1000,
  };
  return quantity * (unitConversion[unit] || 1);
}

// --- Report Logging with Timestamp & Google Sheets Integration ---
// Log a report entry with timestamp; also send it to Google Sheets via a web app endpoint.
function logReport(action, name, quantity, unit) {
  const reportEntry = {
    action,
    name,
    quantity,
    unit,
    time: new Date().toISOString()
  };
  let reports = JSON.parse(localStorage.getItem("chemicalReports")) || [];
  reports.push(reportEntry);
  localStorage.setItem("chemicalReports", JSON.stringify(reports));

  // Send the log entry to Google Sheets via a Google Apps Script web app endpoint
  sendReportToGoogleSheets(reportEntry);
}

function sendReportToGoogleSheets(reportEntry) {
  // Replace with your deployed Google Apps Script Web App URL
  const googleSheetsEndpoint = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
  
  fetch(googleSheetsEndpoint, {
    method: "POST",
    mode: "no-cors", // 'no-cors' mode since Google Apps Script web apps may not send CORS headers by default
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(reportEntry)
  })
  .then(() => {
    console.log("Report sent to Google Sheets.");
  })
  .catch((error) => {
    console.error("Error sending report to Google Sheets:", error);
  });
}

// Searches chemicals based on user input
export function searchChemicals() {
  let searchQuery = document.getElementById("searchBar").value.toLowerCase();
  let filteredChemicals = chemicals.filter(chem => chem.name.toLowerCase().includes(searchQuery));
  displayChemicals(filteredChemicals);
}

// Sorts chemicals based on selected criteria
export function sortChemicals() {
  let sortBy = document.getElementById("sort").value;
  chemicals.sort((a, b) => {
    let quantityA = convertToBaseUnit(a.quantity, a.unit);
    let quantityB = convertToBaseUnit(b.quantity, b.unit);
    if (sortBy === "low-quantity") {
      return quantityA - quantityB;
    } else if (sortBy === "high-quantity") {
      return quantityB - quantityA;
    } else if (sortBy === "latest-time") {
      return new Date(b.time) - new Date(a.time);
    }
  });
  saveToLocalStorage();
  displayChemicals(chemicals);
}

// Renders the list of chemicals into the DOM
export function displayChemicals(list) {
  const chemicalList = document.getElementById("chemicalList");
  chemicalList.innerHTML = "";
  list.forEach((chem) => {
    chemicalList.innerHTML += `
      <li class="chemical-item">
        <span>${chem.name} - ${chem.quantity} ${chem.unit} (Updated: ${new Date(chem.time).toLocaleString()})</span>
        <div>
          <button class="edit-btn" onclick="editChemical('${chem.name}')">Edit</button>
          <button class="add-btn" onclick="addQuantity('${chem.name}')">Add</button>
          <button class="delete-btn" onclick="deleteChemical('${chem.name}')">Delete</button>
        </div>
      </li>`;
  });
}

// Adds a new chemical if user has permission
export function addChemical() {
  if (!window.allowedToEdit) {
    alert("You do not have permission to add chemicals.");
    return;
  }
  let name = prompt("Enter chemical name:");
  let quantity = parseFloat(prompt("Enter quantity:"));
  let unit = prompt("Enter unit (ml, litre, g, kg, etc.):").toLowerCase();
  let time = new Date().toISOString();

  if (!name || isNaN(quantity) || !unit) {
    alert("Invalid input!");
    return;
  }

  let exists = chemicals.some(chem => chem.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    alert("Chemical already exists!");
    return;
  }

  chemicals.push({ name, quantity, unit, time });
  logReport("added", name, quantity, unit);
  saveToLocalStorage();
  displayChemicals(chemicals);
}

// Edits an existing chemical if user has permission
export function editChemical(name) {
  if (!window.allowedToEdit) {
    alert("You do not have permission to edit chemicals.");
    return;
  }
  let chemical = chemicals.find(chem => chem.name === name);
  if (!chemical) {
    alert("Chemical not found!");
    return;
  }

  let newQuantity = parseFloat(prompt(`Enter new quantity for ${name} (${chemical.unit}):`));
  let newUnit = prompt(`Enter new unit for ${name} (${chemical.unit}):`).toLowerCase();

  if (isNaN(newQuantity) || newQuantity < 0 || !newUnit) {
    alert("Invalid input!");
    return;
  }

  chemical.quantity = newQuantity;
  chemical.unit = newUnit;
  chemical.time = new Date().toISOString();
  logReport("edited", name, newQuantity, newUnit);
  saveToLocalStorage();
  displayChemicals(chemicals);
}

// Adds quantity to an existing chemical if user has permission
export function addQuantity(name) {
  if (!window.allowedToEdit) {
    alert("You do not have permission to add quantity.");
    return;
  }
  let chemical = chemicals.find(chem => chem.name === name);
  if (!chemical) {
    alert("Chemical not found!");
    return;
  }

  let additionalQuantity = parseFloat(prompt(`Enter quantity to add for ${name} (${chemical.unit}):`));
  if (isNaN(additionalQuantity) || additionalQuantity <= 0) {
    alert("Invalid quantity!");
    return;
  }

  let selectedUnit = prompt("Select unit: ml, litre, g, kg").toLowerCase();
  const validUnits = ["ml", "litre", "g", "kg"];
  if (!validUnits.includes(selectedUnit)) {
    alert("Invalid unit! Please enter ml, litre, g, or kg.");
    return;
  }

  let baseCurrent = convertToBaseUnit(chemical.quantity, chemical.unit);
  let baseNew = convertToBaseUnit(additionalQuantity, selectedUnit);

  chemical.quantity = (baseCurrent + baseNew) / convertToBaseUnit(1, selectedUnit);
  chemical.unit = selectedUnit;
  chemical.time = new Date().toISOString();
  logReport("added quantity", name, additionalQuantity, selectedUnit);
  saveToLocalStorage();
  displayChemicals(chemicals);
}

// Deletes a chemical if user has permission
export function deleteChemical(name) {
  if (!window.allowedToEdit) {
    alert("You do not have permission to delete chemicals.");
    return;
  }
  let chemical = chemicals.find(chem => chem.name === name);
  if (confirm(`Are you sure you want to delete ${name}?`)) {
    chemicals = chemicals.filter(chem => chem.name !== name);
    logReport("deleted", name, chemical.quantity, chemical.unit);
    saveToLocalStorage();
    displayChemicals(chemicals);
  }
}

// Saves chemicals to localStorage
export function saveToLocalStorage() {
  localStorage.setItem("chemicals", JSON.stringify(chemicals));
}

// Loads chemicals from localStorage
export function loadFromLocalStorage() {
  let storedChemicals = localStorage.getItem("chemicals");
  if (storedChemicals) {
    chemicals = JSON.parse(storedChemicals);
    displayChemicals(chemicals);
  }
}

// Toggles dark mode and saves preference
export function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  let mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
  localStorage.setItem("theme", mode);
}

// Closes the modal window
export function closeModal() {
  document.getElementById("chemicalModal").style.display = "none";
}
