// Citation for this file:
// Date: 2/15/2024
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Application: Visual Studio Code, version 1.85.1 
// Type: starter/example code provided by Dr. Michael Curry, starter/example code is filled in/modified by Jason Szeto
// Author(s): Dr. Michael Curry, Jason Szeto
// Code version: N/A

// Get the objects we need to modify
let addDriverForm = document.getElementById('add-driver-form-ajax');

// Modify the objects we need
addDriverForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEmail = document.getElementById("input-email");
    let inputFirstName = document.getElementById("input-firstname");
    let inputMiddleName = document.getElementById("input-middlename");
    let inputLastName = document.getElementById("input-lastname");

    // Get the values from the form fields
    let emailValue = inputEmail.value;
    let firstNameValue = inputFirstName.value;
    let middleNameValue = inputMiddleName.value;
    let lastNameValue = inputLastName.value;


    // Put our data we want to send in a javascript object
    let data = {
        email: emailValue,
        firstname: firstNameValue,
        middlename: middleNameValue,
        lastname: lastNameValue
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-driver-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);
            // Clear the input fields for another transaction
            inputEmail.value = '';
            inputFirstName.value = '';
            inputMiddleName.value = null;
            inputLastName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    console.log(data)
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("drivers-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let driveridCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let firstnameCell = document.createElement("TD");
    let middlenameCell = document.createElement("TD");
    let lastnameCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    driveridCell.innerText = newRow.driverID;
    emailCell.innerText = newRow.email;
    firstnameCell.innerText = newRow.firstName;
    middlenameCell.innerText = newRow.middleName;
    lastnameCell.innerText = newRow.lastName;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteDriver(newRow.driverID);
    };

    // Add the cells to the row
    row.appendChild(driveridCell);
    row.appendChild(emailCell);
    row.appendChild(firstnameCell);
    row.appendChild(middlenameCell);
    row.appendChild(lastnameCell);
    
    row.appendChild(deleteCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.driverID);

    // Add the row to the table
    currentTable.appendChild(row);
}