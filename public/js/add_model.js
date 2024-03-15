// Citation for this file:
// Date: 2/15/2024
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Application: Visual Studio Code, version 1.85.1 
// Type: starter/example code provided by Dr. Michael Curry, starter/example code is filled in/modified by Jason Szeto
// Author(s): Dr. Michael Curry
// Code version: N/A

// Get the objects we need to modify
let addModelForm = document.getElementById('add-model-form-ajax');

// Modify the objects we need
addModelForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputModelName = document.getElementById("input-modelname");
    let inputModelYear = document.getElementById("input-modelyear");

    // Get the values from the form fields
    let modelNameValue = inputModelName.value;
    let modelYearValue = parseInt(inputModelYear.value);
    // Put our data we want to send in a javascript object
    let data = {
        modelname: modelNameValue,
        modelyear: modelYearValue
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-model-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputModelName.value = '';
            inputModelYear.value = '';
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
    let currentTable = document.getElementById("models-table");
    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 3 cells
    let row = document.createElement("TR");
    let modelidCell = document.createElement("TD");
    let modelnameCell = document.createElement("TD");
    let modelyearCell = document.createElement("TD");

    // Fill the cells with correct data
    modelidCell.innerText = newRow.modelID;
    modelnameCell.innerText = newRow.modelName;
    modelyearCell.innerText = newRow.modelYear;

    // Add the cells to the row
    row.appendChild(modelidCell);
    row.appendChild(modelnameCell);
    row.appendChild(modelyearCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.modelID);

    // Add the row to the table
    currentTable.appendChild(row);

    // Reload data
    location.reload()
}