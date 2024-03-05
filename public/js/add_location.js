// Citation for this file:
// Date: 2/15/2024
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Application: Visual Studio Code, version 1.85.1 
// Type: starter/example code provided by Dr. Michael Curry, starter/example code is filled in/modified by Jason Szeto
// Author(s): Dr. Michael Curry, Jason Szeto
// Code version: N/A

// Get the objects we need to modify
let addLocationForm = document.getElementById('add-location-form-ajax');

// Modify the objects we need
addLocationForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCity = document.getElementById("input-city");
    let inputState = document.getElementById("input-state");
    let inputAddress = document.getElementById("input-address");
    let inputLocationVehicleCapacity = document.getElementById("input-locationvehiclecapacity");

    // Get the values from the form fields
    let cityValue = inputCity.value;
    let stateValue = inputState.value;
    let addressValue = inputAddress.value;
    let locationVehicleCapacityValue = parseInt(inputLocationVehicleCapacity.value);


    // Put our data we want to send in a javascript object
    let data = {
        city: cityValue,
        state: stateValue,
        address: addressValue,
        locationvehiclecapacity: locationVehicleCapacityValue
    }
    console.log(data)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCity.value = '';
            inputState.value = '';
            inputAddress.value = '';
            inputLocationVehicleCapacity.value = '';
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
    let currentTable = document.getElementById("locations-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let locationidCell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let addressCell = document.createElement("TD");
    let locationvehiclecapacityCell = document.createElement("TD");

    // Fill the cells with correct data
    locationidCell.innerText = newRow.locationID;
    cityCell.innerText = newRow.city;
    stateCell.innerText = newRow.state;
    addressCell.innerText = newRow.address;
    locationvehiclecapacityCell.innerText = newRow.locationVehicleCapacity;

    // Add the cells to the row
    row.appendChild(locationidCell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(addressCell);
    row.appendChild(locationvehiclecapacityCell);
    
    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.driverID);

    // Add the row to the table
    currentTable.appendChild(row);
}