// Citation for this file:
// Date: 2/15/2024
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Application: Visual Studio Code, version 1.85.1 
// Type: starter/example code provided by Dr. Michael Curry, starter/example code is filled in/modified by Jason Szeto
// Author(s): Dr. Michael Curry
// Code version: N/A

// Get the objects we need to modify
let addRentalForm = document.getElementById('add-rental-form-ajax');

// Modify the objects we need
addRentalForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputVehicleID = document.getElementById("mySelectMakeNameModelNameYear");
    let inputStartDate = document.getElementById("input-startdate");
    let inputEndDate = document.getElementById("input-enddate");

    // Get the values from the form fields
    let vehicleIDValue = parseInt(inputVehicleID.value);
    let startDateValue = inputStartDate.value;
    let endDateValue = inputEndDate.value;

    // Put our data we want to send in a javascript object
    let data = {
        vehicleid: vehicleIDValue,
        startdate: startDateValue,
        enddate: endDateValue,
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-rental-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputVehicleID.value = '';
            inputStartDate.value = '';
            inputEndDate.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("rentals-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let rentalidCell = document.createElement("TD");
    let vehicleidCell = document.createElement("TD");
    let startdateCell = document.createElement("TD");
    let enddateCell = document.createElement("TD");

    // Fill the cells with correct data
    rentalidCell.innerText = newRow.rentalID;
    vehicleidCell.innerText = newRow.makeNameModelNameYear;
    startdateCell.innerText = newRow.startDate.split('T')[0];
    enddateCell.innerText = newRow.endDate.split('T')[0];

    // Add the cells to the row
    row.appendChild(rentalidCell);
    row.appendChild(vehicleidCell);
    row.appendChild(startdateCell);
    row.appendChild(enddateCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.rentalID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Create dropdown menu
    let selectMenuMakeNameModelNameYear = document.getElementById("mySelectMakeNameModelNameYear");
    let optionMakeNameModelNameYear = document.createElement("option");
    optionMakeNameModelNameYear.text = newRow.makeNameModelNameYear;
    optionMakeNameModelNameYear.value = newRow.vehicleID;
    selectMenuMakeNameModelNameYear.add(optionMakeNameModelNameYear);

    // Reload data
    location.reload()
}