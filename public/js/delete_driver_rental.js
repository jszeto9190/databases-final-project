// Citation for this file:
// Date: 2/15/2024
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Application: Visual Studio Code, version 1.85.1 
// Type: starter/example code provided by Dr. Michael Curry, starter/example code is filled in/modified by Jason Szeto
// Author(s): Dr. Michael Curry
// Code version: N/A

function deleteDriverRental(driverIDRentalID) {
    // Put our data we want to send in a javascript object
    let data = {
        driveridrentalid: driverIDRentalID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-driver-rental-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(driverIDRentalID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(driverIDRentalID){

    let table = document.getElementById("driversrentals-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == driverIDRentalID) {
            table.deleteRow(i);
            break;
       }
    }
}