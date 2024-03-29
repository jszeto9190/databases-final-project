// Citation for this file:
// Date: 2/15/2024
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Application: Visual Studio Code, version 1.85.1 
// Type: starter/example code provided by Dr. Michael Curry, starter/example code is filled in/modified by Jason Szeto
// Author(s): Dr. Michael Curry
// Code version: N/A

// Get the objects we need to modify
let addVehicleForm = document.getElementById('add-vehicle-form-ajax');

// Modify the objects we need
addVehicleForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputLocationID = document.getElementById("mySelectFullAddress");
    let inputMakeID = document.getElementById("mySelectMakeName");
    let inputModelID = document.getElementById("mySelectModelYear");
    let inputMileage = document.getElementById("input-mileage");

    // Get the values from the form fields
    let locationIDValue =  inputLocationID.value ? parseInt(inputLocationID.value) : null;
    let makeIDValue = parseInt(inputMakeID.value);
    let modelIDValue = parseInt(inputModelID.value);
    let mileageValue = parseInt(inputMileage.value);

    // Put our data we want to send in a javascript object
    let data = {
        locationid: locationIDValue,
        makeid: makeIDValue,
        modelid: modelIDValue,
        mileage: mileageValue,
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-vehicle-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);
            // Clear the input fields for another transaction
            inputLocationID.value = '';
            inputMakeID.value = '';
            inputModelID.value = '';
            inputMileage.value = '';
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
    let currentTable = document.getElementById("vehicles-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    
    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 5 cells
    let row = document.createElement("TR");
    let vehicleidCell = document.createElement("TD");
    let locationidCell = document.createElement("TD");
    let makeidCell = document.createElement("TD");
    let modelidCell = document.createElement("TD");
    let mileageCell = document.createElement("TD");

    // Fill the cells with correct data
    vehicleidCell.innerText = newRow.vehicleID;
    locationidCell.innerText = newRow.fullAddress ? newRow.fullAddress : "N/A";
    makeidCell.innerText = newRow.makeName;
    modelidCell.innerText = newRow.modelNameYear;
    mileageCell.innerText = newRow.vehicleMileage;

    // Add the cells to the row
    row.appendChild(vehicleidCell);
    row.appendChild(locationidCell);
    row.appendChild(makeidCell);
    row.appendChild(modelidCell);
    row.appendChild(mileageCell);


    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.vehicleID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenuFullAddress = document.getElementById("mySelectFullAddress");
    let optionFullAddress = document.createElement("option");
    optionFullAddress.text = newRow.fullAddress ? newRow.fullAddress : "N/A";
    optionFullAddress.value = newRow.locationID;
    selectMenuFullAddress.add(optionFullAddress);

    // Create dropdown menu
    let selectMenuMakeName = document.getElementById("mySelectMakeName");
    let optionMakeName = document.createElement("option");
    optionMakeName.text = newRow.makeName;
    optionMakeName.value = newRow.makeID;
    selectMenuMakeName.add(optionMakeName);

    // Create dropdown menu
    let selectMenuModelYear = document.getElementById("mySelectModelYear");
    let optionModelYear = document.createElement("option");
    optionModelYear.text = newRow.modelYear;
    optionModelYear.value = newRow.modelID;
    selectMenuModelYear.add(optionModelYear);

    
    // Reload data 
    location.reload()
}