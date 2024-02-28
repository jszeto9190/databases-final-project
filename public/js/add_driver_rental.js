// Citation for this file:
// Date: 2/15/2024
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Application: Visual Studio Code, version 1.85.1 
// Type: starter/example code provided by Dr. Michael Curry, starter/example code is filled in/modified by Jason Szeto
// Author(s): Dr. Michael Curry, Jason Szeto
// Code version: N/A

// Get the objects we need to modify
let addDriverRentalForm = document.getElementById('add-driver-rental-form-ajax');

// Modify the objects we need
addDriverRentalForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDriverID = document.getElementById("input-driverid");
    let inputRentalID = document.getElementById("input-rentalid");

    // Get the values from the form fields
    let driverIDValue = inputDriverID.value;
    let rentalIDValue = inputRentalID.value;

    // Put our data we want to send in a javascript object
    let data = {
        driverid: driverIDValue,
        rentalid: rentalIDValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-driver-rental-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputDriverID.value = 0;
            inputRentalID.value = 0;
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("driversrentals-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let driversIDRentalsIDCell = document.createElement("TD");
    let driverIDCell = document.createElement("TD");
    let rentalIDCell = document.createElement("TD");


    // Fill the cells with correct data
    driversIDRentalsIDCell.innerText = newRow.driversIDRentalsID;
    driverIDCell.innerText = newRow.driverID;
    rentalIDCell.innerText = newRow.rentalID;

    // Add the cells to the row
    row.appendChild(driversIDRentalsIDCell);
    row.appendChild(driverIDCell);
    row.appendChild(rentalIDCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.driversIDRentalsID);

    // Add the row to the table
    currentTable.appendChild(row);
}