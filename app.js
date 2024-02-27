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

PORT = 9480;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.


// Static Files
//app.use(express.static('public'))
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

            res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

app.post('/add-driver-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let middlename = parseInt(data.middlename);
    if (isNaN(middlename))
    {
        middlename = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Drivers (email, firstName, middleName, lastName) VALUES ('${data.email}', '${data.firstname}', '${middlename}', '${data.lastname}' )`;
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
    
    // Capture NULL values
    let middlename = parseInt(data['input-firstname']);
    if (isNaN(middlename))
    {
        middlename = 'NULL'
    }
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Drivers (email, firstName, middleName, lastName) VALUES ('${data['input-email']}', '${data['input-firstname']}', '${middlename}', '${data['input-lastname']}' )`;
    db.pool.query(query1, function(error, rows, fields) {
    
        // Check to see if there was an error
        if (error) {
    
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
        }
    
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
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





/* DRIVERSRENTALS */
app.get('/driversrentals', function(req, res)
    {
        let query1 = "SELECT * FROM DriversRentals;";
        db.pool.query(query1, function(error, rows, fields){
            res.render('drivers_rentals', {data: rows});
        })
    });

app.post('/add-driver-rental-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;


        // Create the query and run it on the database
        query1 = `INSERT INTO DriversRentals (driverID, rentalID) VALUES ('${data.driverid}', '${data.rentalid}')`;
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
        
        // Create the query and run it on the database
        query1 = `INSERT INTO DriversRentals (driverID, rentalID) VALUES ('${data[input-driverid]}', '${data[input-rentalid]}')`;
        db.pool.query(query1, function(error, rows, fields) {
        
            // Check to see if there was an error
            if (error) {
        
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
            }
        
            // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
            // presents it on the screen
            else {
                 res.redirect('/');
                 }
        })
        });





/* RENTALS */
  app.get('/rentals', function(req, res)
  {   
      let query1;

      if (req.query.startdate === undefined)
      {
          query1 = 'SELECT * FROM Rentals;';
      }
      else
      {
          query1 = `SELECT * FROM Rentals WHERE startDate LIKE "${req.query.startdate}%"`
      }

      db.pool.query(query1, function(error, rows, fields){    // Execute the query

          res.render('rentals', {data: rows});                  // Render the rentals.hbs file, and also send the renderer
      })                                                      // an object where 'data' is equal to the 'rows' we
  });                                                         // received back from the query

app.post('/add-rental-ajax', function(req, res) 
{
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  query1 = `INSERT INTO Rentals (vehicleID, startDate, endDate) VALUES (${data.vehicleid}, ${data.startdate}, ${data.enddate})`;
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
 
  // Create the query and run it on the database
  query1 = `INSERT INTO Rentals (vehicleID, startDate, endDate) VALUES (${data['input-vehicleid']}, ${data['input-startdate']}, ${data['input-enddate']})`;
  db.pool.query(query1, function(error, rows, fields) {
  
      // Check to see if there was an error
      if (error) {
  
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error)
      res.sendStatus(400);
      }
  
      // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
      // presents it on the screen
      else {
           res.redirect('/rentals');
           }
  })
  });

app.delete('/delete-rental-ajax/', function(req,res,next){
  let data = req.body;
  let rentalID = parseInt(data.driverid);
  let deleteRentals = `DELETE FROM Rentals WHERE rentalID = ?`;
  let deleteDriversRentals= `DELETE FROM DriversRentals WHERE rentalID = ?`;

        // Run the 1st query
        db.pool.query(deleteRentals, [rentalID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deleteDriversRentals, [rentalID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
})});





/* VEHICLES */
app.get('/vehicles', function(req, res)
{
    let query1 = "SELECT * FROM Vehicles;";
    db.pool.query(query1, function(error, rows, fields){
        res.render('vehicles', {data: rows});
    })
});

app.post('/add-vehicle-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Vehicles (locationID, makeID, modelID, mileage) VALUES (${data.locationid}, ${data.makeid}, ${data.modelid},${data.mileage})`;
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
                // If all went well, send the results of the query back.
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
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Vehicles (locationID, makeID, modelID, mileage) VALUES (${data['input-locationid']}, ${data['input-makeid']}, ${data['input-modelid']}, ${data['input-mileage']})`;
    db.pool.query(query1, function(error, rows, fields) {
    
        // Check to see if there was an error
        if (error) {
    
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
        }
    
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else {
             res.redirect('/vehicles');
             }
    })
    });



/* MAKES */
app.get('/makes', function(req, res)
{
    let query1 = "SELECT * FROM Makes;";
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
    
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
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

    // Create the query and run it on the database
    query1 = `INSERT INTO Models (modelName, modelYear) VALUES ('${data.modelname}', ${data.modelyear} )`;
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
                // If all went well, send status.
                else
                {
                    res.sendStatus(204);
                }
            })
        }
    })
});


app.post('/add-model-form', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Models (modelName, modelYear) VALUES ('${data['input-modelname']}', ${data[input-modelyear]})`;
    db.pool.query(query1, function(error, rows, fields) {
    
        // Check to see if there was an error
        if (error) {
    
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
        }
    
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
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

    // Create the query and run it on the database
    query1 = `INSERT INTO Locations (city, state, address, locationVehicleCapacity) VALUES ('${data.city}', '${data.state}', '${data.address}', '${data.locationvehiclecapacity}' )`;
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
    query1 = `INSERT INTO Locations (city, state, address, locationVehicleCapacity) VALUES ('${data['input-city']}', '${data['input-state']}', '${data['input-address']}', '${data['input-locationvehiclecapacity']}' )`;
    db.pool.query(query1, function(error, rows, fields) {
    
        // Check to see if there was an error
        if (error) {
    
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400);
        }
    
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
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