// Citation for this file:
// Date: 2/15/2024
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Application: Visual Studio Code, version 1.85.1 
// Type: starter/example code provided by Dr. Michael Curry, starter/example code is filled in/modified by Jason Szeto
// Author(s): Dr. Michael Curry, Jason Szeto
// Code version: N/A

// Get the objects we need to modify
let updateVehicleForm = document.getElementById('update-vehicle-form-ajax');

// Modify the objects we need
updateVehicleForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputVehicleID = document.getElementById("mySelectVehicleInformation");
    let inputLocationID = document.getElementById("mySelectLocationInformation");

    // Get the values from the form fields
    let vehicleIDValue = parseInt(inputVehicleID.value);
    let locationIDValue = parseInt(inputLocationID.value);
    
    // Put our data we want to send in a javascript object
    let data = {
        vehicleid: vehicleIDValue,
        locationid: locationIDValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-vehicle-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            console.log(xhttp.response)
            updateRow(xhttp.response, parseInt(vehicleIDValue), parseInt(locationIDValue));
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
    console.log(JSON.stringify(data))
    location.reload()
})


function updateRow(data, vehicleID, locationID){
    console.log(data)
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("vehicles-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == parseInt(vehicleID)) {

            // Get the location of the row where we found the matching driver ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            console.log(updateRowIndex)
            // Get td of email value
            let td = updateRowIndex.getElementsByTagName("td")[1];
            console.log(td)
            // Reassign email to our value we updated to
            console.log(parsedData)
            td.innerHTML = parseInt(locationID);

       }
    }
    location.reload()
}