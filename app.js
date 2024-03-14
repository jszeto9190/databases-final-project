// Citation for this file:
// Date: 2/15/2024
// URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Application: Visual Studio Code, version 1.85.1 
// Type: starter/example code provided by Dr. Michael Curry, starter/example code is filled in/modified by Jason Szeto
// Author(s): Dr. Michael Curry, Jason Szeto
// Code version: N/A

/*
    SETUP
*/
// Express
var express = require('express');
var app = express();
app.use(express.json())

PORT = 9482;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


// Static Files
app.use(express.static(__dirname + '/public')); // this is needed to allow for the form to use the ccs style sheet


/* DRIVERS */
app.get('/', function(req, res)
    {   
        let query1;

        if (req.query.lastname === undefined)
        {
            query1 = 'SELECT * FROM Drivers;';
        }
        else
        {
            query1 = `SELECT * FROM Drivers WHERE lastName LIKE "${req.query.lastname}%"`
        }

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('index', {data: rows});                  
        })                                                      
    });                                                         

app.post('/add-driver-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let middlename = data.middlename ? data.middlename : null;
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Drivers (email, firstName, middleName, lastName) VALUES (?, ?, ?, ?)`;
    db.pool.query(query1, [data.email, data.firstname, middlename, data.lastname], function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT *
            query2 = `SELECT * FROM Drivers;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


app.post('/add-driver-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let middlename = data['input-middlename'] ? data['input-middlename'] : null;

    // Create the query and run it on the database
    let query1 = `INSERT INTO Drivers (email, firstName, middleName, lastName) VALUES (?, ?, ?, ?)`;
    db.pool.query(query1, [data['input-email'], data['input-firstname'], middlename, data['input-lastname']], function(error, rows, fields) {
    
        // Check to see if there was an error
        if (error) {
    
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
        }
        else {
             res.redirect('/');
             }
    })
    });

app.delete('/delete-driver-ajax/', function(req,res,next){
    let data = req.body;
    let driverID = parseInt(data.driverid);
    let deleteDrivers = `DELETE FROM Drivers WHERE driverID = ?`;
    let deleteDriversRentals= `DELETE FROM DriversRentals WHERE driverID = ?`;
  
          // Run the 1st query
          db.pool.query(deleteDrivers, [driverID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteDriversRentals, [driverID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

app.put('/put-driver-ajax', function(req,res,next){
    let data = req.body;
    let email = data.email;
    let driverid = data.driverid;

    let queryUpdateEmail = `UPDATE Drivers SET email = ? WHERE driverID = ?`;

          // Run the 1st query
          db.pool.query(queryUpdateEmail, [email, driverid], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the
              // table on the front-end
              else
              {
              res.send(rows);
              console.log(rows);
              }
  })});



/* DRIVERSRENTALS */
app.get('/driversrentals', function(req, res)
    {
        let query1 = `
        SELECT
            DriversRentals.driverIDRentalID,
            Drivers.driverID,
            CONCAT(Drivers.firstName, ' ', COALESCE(Drivers.middleName, ''), ' ', Drivers.lastName, ' (', Drivers.email, ') ') AS driverFullNameEmail,
            CONCAT(Makes.makeName, ' ', Models.modelName, ' (', Models.modelYear,', ', Vehicles.mileage, ' miles) from ', DATE_FORMAT(Rentals.startDate, '%Y-%m-%d'), ' to ', DATE_FORMAT(Rentals.endDate, '%Y-%m-%d')) AS makeNameModelNameYearDate
        FROM
            DriversRentals
        LEFT JOIN Rentals ON DriversRentals.rentalID = Rentals.rentalID
        LEFT JOIN Drivers ON DriversRentals.driverID = Drivers.driverID
        LEFT JOIN Vehicles ON Rentals.vehicleID = Vehicles.vehicleID
        LEFT JOIN Makes ON Vehicles.makeID = Makes.makeID
        LEFT JOIN Models ON Vehicles.modelID = Models.modelID;`;
        
        let query2 = `
        SELECT * FROM Drivers;`;

        let query3 = `
        SELECT 
            Rentals.rentalID,
            CONCAT(Makes.makeName, ' ', Models.modelName, ' (', Models.modelYear,', ', Vehicles.mileage, ' miles) ') AS makeNameModelNameYear,
            DATE_FORMAT(Rentals.startDate, '%Y-%m-%d') AS rentalStartDate,
            DATE_FORMAT(Rentals.endDate, '%Y-%m-%d') AS rentalEndDate
        FROM
            Rentals
        LEFT JOIN Vehicles ON Rentals.vehicleID = Vehicles.vehicleID
        LEFT JOIN Makes ON Vehicles.makeID = Makes.makeID
        LEFT JOIN Models ON Vehicles.modelID = Models.modelID;`;

        db.pool.query(query1, function(error, rows, fields){

            let driversRentalsdata = rows

            db.pool.query(query2, function(error, rows, fields){
            
            let driversData = rows;
                
                db.pool.query(query3, function(error, rows, fields){

                    let rentalsData = rows;

                    res.render('drivers_rentals', {data: driversRentalsdata, driversData: driversData, rentalsData: rentalsData});
                })
            })
        })
    });

app.post('/add-driver-rental-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;

        let driverid = parseInt(data.driverid);
        let rentalid = parseInt(data.rentalid);

        // Create the query and run it on the database
        query1 = `INSERT INTO DriversRentals (driverID, rentalID) VALUES (${driverid}, ${rentalid})`;
        db.pool.query(query1, function(error, rows, fields){

            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT *
                query2 = `SELECT * FROM DriversRentals;`;
                db.pool.query(query2, function(error, rows, fields){

                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });
    
    
app.post('/add-driver-rental-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    let driverid = parseInt(data['input-driverid']);
    let rentalid = parseInt(data['input-rentalid']);

    // Create the query and run it on the database
    query1 = `INSERT INTO DriversRentals (driverID, rentalID) VALUES (${driverid}, ${rentalid})`;
    db.pool.query(query1, function(error, rows, fields) {
    
        // Check to see if there was an error
        if (error) {
    
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
        }
        else {
                res.redirect('/driversrentals');
                }
    })
    });

app.delete('/delete-driver-rental-ajax/', function(req,res,next){
    let data = req.body;
    let driverIDRentalID = parseInt(data.driveridrentalid);
    let deleteDriversRentals = `DELETE FROM DriversRentals WHERE driverIDRentalID = ?`;
    
            // Run the 1st query
            db.pool.query(deleteDriversRentals, [driverIDRentalID], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
                else {
                    res.sendStatus(204);
                }
            })});

app.put('/put-driver-rental-ajax', function(req,res,next){
    let data = req.body;
    let rentalid = data.rentalid;
    let driveridrentalid = data.driveridrentalid;

    let queryUpdateRental = `UPDATE DriversRentals SET rentalID = ? WHERE driverIDRentalID = ?`;

            // Run the 1st query
            db.pool.query(queryUpdateRental, [rentalid, driveridrentalid], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the
                // table on the front-end
                else
                {
                res.send(rows);
                console.log(rows);
                }
    })});
            


/* RENTALS */
app.get('/rentals', function(req, res)
{   
    let query1 = `
    SELECT 
        Rentals.rentalID,
        CONCAT(Makes.makeName, ' ', Models.modelName, ' (', Models.modelYear,', ', Vehicles.mileage, ' miles) ') AS makeNameModelNameYear,
        DATE_FORMAT(Rentals.startDate, '%Y-%m-%d') AS rentalStartDate,
        DATE_FORMAT(Rentals.endDate, '%Y-%m-%d') AS rentalEndDate
    FROM
        Rentals
    LEFT JOIN Vehicles ON Rentals.vehicleID = Vehicles.vehicleID
    LEFT JOIN Makes ON Vehicles.makeID = Makes.makeID
    LEFT JOIN Models ON Vehicles.modelID = Models.modelID;`;

    let query2 = `
    SELECT 
        Vehicles.vehicleID,
        Makes.makeName,
        Models.modelName,
        Models.modelYear,
        Vehicles.mileage
    FROM
        Vehicles
    JOIN Makes ON Vehicles.makeID = Makes.makeID
    JOIN Models ON Vehicles.modelID = Models.modelID;`;

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
          
            let rentalData = rows;

            db.pool.query(query2, function(error, rows, fields){

                let vehiclesData = rows;

                res.render('rentals', {data: rentalData, vehiclesData: vehiclesData });                 
            })
        })                                                  
});                                                         

app.post('/add-rental-ajax', function(req, res) 
{
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;
  let vehicleid = parseInt(data.vehicleid);
  let startdate = data.startdate;
  let enddate = data.enddate;

  // Create the query and run it on the database
  query1 = `INSERT INTO Rentals (vehicleID, startDate, endDate) VALUES (${vehicleid}, '${startdate}', '${enddate}')`;
  db.pool.query(query1, function(error, rows, fields){

      // Check to see if there was an error
      if (error) {

          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error)
          res.sendStatus(400);
      }
      else
      {
          // If there was no error, perform a SELECT *
          query2 = `SELECT * FROM Rentals;`;
          db.pool.query(query2, function(error, rows, fields){

              // If there was an error on the second query, send a 400
              if (error) {
                  
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
              }
              // If all went well, send the results of the query back.
              else
              {
                  res.send(rows);
              }
          })
      }
  })
});


app.post('/add-rental-form', function(req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;
  let vehicleid = parseInt(data['input-makeNameModelNameYear']);
  let startdate = data['input-startdate'];
  let enddate = data['input-enddate'];
 
  // Create the query and run it on the database
  query1 = `INSERT INTO Rentals (vehicleID, startDate, endDate) VALUES (${vehicleid}, '${startdate}', '${enddate}')`;
  db.pool.query(query1, function(error, rows, fields) {
  
      // Check to see if there was an error
      if (error) {
  
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error)
      res.sendStatus(400);
      }
      else {
           res.redirect('/rentals');
           }
  })
  });

  


/* VEHICLES */
app.get('/vehicles', function(req, res)
{
    let query1 = `
    SELECT 
        Vehicles.vehicleID, 
        CASE 
            WHEN Locations.address IS NULL AND Locations.city IS NULL AND Locations.state IS NULL THEN 'N/A'
            ELSE CONCAT(COALESCE(Locations.address, ''), ', ', COALESCE(Locations.city, ''), ', ', COALESCE(Locations.state, ''))
        END AS fullAddress, 
        Makes.makeName, 
        CONCAT(Models.modelName, ' (', Models.modelYear, ')') AS modelNameYear, 
        Vehicles.mileage AS vehicleMileage 
    FROM 
        Vehicles 
    LEFT JOIN Models ON Vehicles.modelID = Models.modelID 
    LEFT JOIN Makes ON Vehicles.makeID = Makes.makeID 
    LEFT JOIN Locations ON Vehicles.locationID = Locations.locationID;`;

    let query2 = `SELECT * FROM Locations;`;

    let query3 = `SELECT * FROM Makes;`;

    let query4 = `SELECT * FROM Models;`;

    db.pool.query(query1, function(error, rows, fields){

        let vehiclesData = rows;

        db.pool.query(query2, function(error, rows, fields){
            
            let locationsData = rows;

            db.pool.query(query3, function(error, rows, fields){

                let makesData = rows;

                db.pool.query(query4, function(error, rows, fields){

                    let modelsData = rows;

                    res.render('vehicles', {data: vehiclesData, locationsData: locationsData, makesData: makesData, modelsData:modelsData });
                })
            })
        })
    })
});

app.post('/add-vehicle-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let locationid = data.locationid ? parseInt(data.locationid) : null
    let makeid = parseInt(data.makeid)
    let modelid = parseInt(data.modelid)
    let mileage = parseInt(data.mileage)

    // Create the query and run it on the database
    query1 = `INSERT INTO Vehicles (locationID, makeID, modelID, mileage) VALUES (${locationid}, ${makeid}, ${modelid},${mileage})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT *
            query2 = `SELECT * FROM Vehicles;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send rows.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


app.post('/add-vehicles-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let locationid = data['input-fullAddress'] ? parseInt(data['input-fullAddress']) : null;
    let makeid = parseInt(data['input-makeName']);
    let modelid = parseInt(data['input-modelYear']);
    let mileage = parseInt(data['input-mileage']);
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Vehicles (locationID, makeID, modelID, mileage) VALUES (${locationid}, ${makeid}, ${modelid}, ${mileage})`;
    db.pool.query(query1, function(error, rows, fields) {
    
        // Check to see if there was an error
        if (error) {
    
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
        }
        else {
             res.redirect('/vehicles');
             }
    })
    });

app.put('/put-vehicle-ajax', function(req,res,next){
    let data = req.body;
    let locationid = data.locationid;
    let vehicleid = data.vehicleid;

    let queryUpdateRental = `UPDATE Vehicles SET locationID = ? WHERE vehicleID = ?`;

            // Run the 1st query
            db.pool.query(queryUpdateRental, [locationid, vehicleid], function(error, rows, fields){
                if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error);
                res.sendStatus(400);
                }
    
                // If there was no error, we run our second query and return that data so we can use it to update the people's
                // table on the front-end
                else
                {
                res.send(rows);
                console.log(rows);
                }
    })});


/* MAKES */
app.get('/makes', function(req, res)
{
    let query1 = `SELECT * FROM Makes;`;
    db.pool.query(query1, function(error, rows, fields){
        res.render('makes', {data: rows});
    })
});

app.post('/add-make-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Makes (makeName) VALUES ('${data.makename}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT *
            query2 = `SELECT * FROM Makes;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


app.post('/add-make-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
      
    // Create the query and run it on the database
    query1 = `INSERT INTO Makes (makeName) VALUES ('${data['input-makename']}' )`;
    db.pool.query(query1, function(error, rows, fields) {
    
        // Check to see if there was an error
        if (error) {
    
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
        }
        else {
             res.redirect('/makes');
             }
    })
    });





/* MODELS */
app.get('/models', function(req, res)
{
    let query1 = "SELECT * FROM Models;";
    db.pool.query(query1, function(error, rows, fields){
        res.render('models', {data: rows});
    })
});

app.post('/add-model-ajax', function(req, res) 
{   
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let modelname = data.modelname;
    let modelyear = parseInt(data.modelyear);

    // Create the query and run it on the database
    query1 = `INSERT INTO Models (modelName, modelYear) VALUES ('${modelname}', ${modelyear} )`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT *
            query2 = `SELECT * FROM Models;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send rows.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


app.post('/add-model-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let modelyear = parseInt(data['input-modelyear']);
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Models (modelName, modelYear) VALUES ('${data['input-modelname']}', ${modelyear})`;
    db.pool.query(query1, function(error, rows, fields) {
    
        // Check to see if there was an error
        if (error) {
    
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
        }
        else {
             res.redirect('/models');
             }
    })
    });




/* LOCATIONS */
app.get('/locations', function(req, res)
    {
        let query1 = "SELECT * FROM Locations;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('locations', {data: rows});
        })
    });                                                       // received back from the query

app.post('/add-location-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let locationvehiclecapacity = parseInt(data.locationvehiclecapacity)

    // Create the query and run it on the database
    query1 = `INSERT INTO Locations (city, state, address, locationVehicleCapacity) VALUES ('${data.city}', '${data.state}', '${data.address}', ${locationvehiclecapacity} )`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT *
            query2 = `SELECT * FROM Locations;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


app.post('/add-location-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Locations (city, state, address, locationVehicleCapacity) VALUES ('${data['input-city']}', '${data['input-state']}', '${data['input-address']}', ${data['input-locationvehiclecapacity']} )`;
    db.pool.query(query1, function(error, rows, fields) {
    
        // Check to see if there was an error
        if (error) {
    
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
        }
        else {
             res.redirect('/locations');
             }
    })
    });

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});