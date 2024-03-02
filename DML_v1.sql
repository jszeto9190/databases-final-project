-- Please Note, the @ symbol that is typed before a variable indicates the variable will have data pulled from the backend of the program.

-- Drivers Table
-- Display Drivers Table:
SELECT * FROM Drivers;
-- Search Drivers Table by lastName:
SELECT * FROM Drivers WHERE lastName LIKE @"${req.query.lastname}%";
-- Input data from database into Drivers Table:
INSERT INTO Drivers (email, firstName, middleName, lastName) VALUES (@'${data.email}', @'${data.firstname}', @'${middlename}', @'${data.lastname}' );
-- Input new user created data into Drivers Table:
INSERT INTO Drivers (email, firstName, middleName, lastName) VALUES (@'${data['input-email']}', @'${data['input-firstname']}', @'${middlename}', @'${data['input-lastname']}' );
-- Delete row from Drivers Table by driverID:
DELETE FROM Drivers WHERE driverID = ?;
-- Delete row from DriversRentals Table by driverID:
DELETE FROM DriversRentals WHERE driverID = ?;
-- Update middleName in an entry of Drivers by driverID:
UPDATE Drivers SET  middlename= ? WHERE driverID = ?;

-- DriversRentals Table
-- Display DriversRentals Table:
SELECT * FROM DriversRentals;
-- Input data from database into DriversRentals Table:
INSERT INTO DriversRentals (driverID, rentalID) VALUES (@'${data.driverid}', @'${data.rentalid}');
-- Input new user created data into DriversRentals Table:
INSERT INTO DriversRentals (driverID, rentalID) VALUES (@'${data[input-driverid]}', @'${data[input-rentalid]}');
-- Display corresponding driver information in a dropdown for a certain driverID in DriversRentals Table:
SELECT driverID, CONCAT(firstName, " ",middleName,  " ", lastName) AS fullName 
FROM DriversRentals 
   INNER JOIN Drivers ON driverID = driverID;
-- Add JOINs to connect foreign keys:
SELECT * FROM DriversRentals INNER JOIN Rentals ON rentalID = rentalID;

-- Rentals Table
-- Display Rentals Table:
SELECT * FROM Rentals;
-- Input data from database into Rentals Table:
INSERT INTO Rentals (vehicleID, startDate, endDate) VALUES (@${data.vehicleid}, @${data.startdate}, @${data.enddate});
-- Input new user created data into Rentals Table:
INSERT INTO Rentals (vehicleID, startDate, endDate) VALUES (@${data['input-vehicleid']}, @${data['input-startdate']}, @${data['input-enddate']});
-- Delete row from Rentals Table by rentalID:
DELETE FROM Rentals WHERE rentalID = ?;
-- Delete row from DriversRentals Table by rentalID:
DELETE FROM DriversRentals WHERE rentalID = ?;
-- Add JOINs to connect foreign keys:
SELECT * FROM Rentals INNER JOIN Vehicles ON vehicleID = vehicleID;

-- Vehicles Table
-- Display Rentals Table:
SELECT * FROM Vehicles;
-- Input data from database into Vehicles Table:
INSERT INTO Vehicles (locationID, makeID, modelID, mileage) VALUES (@${data.locationid}, @${data.makeid}, @${data.modelid}, @${data.mileage});
-- Input new user created data into Vehicles Table:
INSERT INTO Vehicles (locationID, makeID, modelID, mileage) VALUES (@${data['input-locationid']}, @${data['input-makeid']}, @${data['input-modelid']}, @${data['input-mileage']});
-- Update locationID (NULLable) in an entry of Vehicles by vehicleID:
UPDATE Vehicles SET  locationID= ? WHERE vehicleID = ?;
-- Add JOINs to connect foreign keys:
SELECT * FROM Vehicles INNER JOIN Models ON modelID = modelID;
SELECT * FROM Vehicles INNER JOIN Makes ON makeID = makeID;
SELECT * FROM Vehicles INNER JOIN Locations ON locationID = locationID;


-- Locations Table
-- Display Locations Table:
SELECT * FROM Locations;
-- Input data from database into Locations Table:
INSERT INTO Locations (city, state, address, locationVehicleCapacity) VALUES (@'${data.city}', @'${data.state}', @'${data.address}', @'${data.locationvehiclecapacity}' );
-- Input new user created data into Locations Table:
INSERT INTO Locations (city, state, address, locationVehicleCapacity) VALUES (@'${data['input-city']}', @'${data['input-state']}', @'${data['input-address']}', @'${data['input-locationvehiclecapacity']}' );

-- Makes Table
-- Display Makes Table:
SELECT * FROM Makes;
-- Input data from database into Makes Table:
INSERT INTO Makes (makeName) VALUES (@'${data.makename}');
-- Input new user created data into Makes Table:
INSERT INTO Makes (makeName) VALUES (@'${data['input-makename']}' );

-- Models Table
-- Display Models Table:
SELECT * FROM Models;
-- Input data from database into Models Table:
INSERT INTO Models (modelName, modelYear) VALUES (@'${data.modelname}', @${data.modelyear} );
-- Input new user created data into Models Table:
INSERT INTO Models (modelName, modelYear) VALUES (@'${data['input-modelname']}', @${data[input-modelyear]});
