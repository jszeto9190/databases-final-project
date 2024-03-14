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
-- Update email in an entry of Drivers by driverID:
UPDATE Drivers SET email = ? WHERE driverID = ?;



-- DriversRentals Table
-- Display data on DriversRentals table by pulling data from Drivers and Rentals:
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
LEFT JOIN Models ON Vehicles.modelID = Models.modelID;
-- Display Drivers table in a dropdown menu so that user can select driver to match to a rental:
SELECT * FROM Drivers;
-- Display Rentals table in a dropdown menu so that user can select driver to match to a rental:
SELECT 
	Rentals.rentalID,
	CONCAT(Makes.makeName, ' ', Models.modelName, ' (', Models.modelYear,', ', Vehicles.mileage, ' miles) ') AS makeNameModelNameYear,
	DATE_FORMAT(Rentals.startDate, '%Y-%m-%d') AS rentalStartDate,
	DATE_FORMAT(Rentals.endDate, '%Y-%m-%d') AS rentalEndDate
FROM
	Rentals
LEFT JOIN Vehicles ON Rentals.vehicleID = Vehicles.vehicleID
LEFT JOIN Makes ON Vehicles.makeID = Makes.makeID
LEFT JOIN Models ON Vehicles.modelID = Models.modelID;
-- Input data from database into DriversRentals Table:
INSERT INTO DriversRentals (driverID, rentalID) VALUES (@'${data.driverid}', @'${data.rentalid}');
-- Display DriversRentals data:
SELECT * FROM DriversRentals;
-- Input new user created data into DriversRentals Table:
INSERT INTO DriversRentals (driverID, rentalID) VALUES (@'${data[input-driverid]}', @'${data[input-rentalid]}');
-- Delete row from DriversRentals Table by driverIDRentalID:
DELETE FROM DriversRentals WHERE driverIDRentalID = ?;
-- Update the rental information for a certain driver that exists in the DriversRentals Table:
UPDATE DriversRentals SET rentalID = ? WHERE driverIDRentalID = ?



-- Rentals Table
-- Display Rentals Table which includes make, model, and vehicle mileage which is from Vehicles data:
SELECT 
	Rentals.rentalID,
	CONCAT(Makes.makeName, ' ', Models.modelName, ' (', Models.modelYear,', ', Vehicles.mileage, ' miles) ') AS makeNameModelNameYear,
	DATE_FORMAT(Rentals.startDate, '%Y-%m-%d') AS rentalStartDate,
	DATE_FORMAT(Rentals.endDate, '%Y-%m-%d') AS rentalEndDate
FROM
	Rentals
LEFT JOIN Vehicles ON Rentals.vehicleID = Vehicles.vehicleID
LEFT JOIN Makes ON Vehicles.makeID = Makes.makeID
LEFT JOIN Models ON Vehicles.modelID = Models.modelID;
-- Display Vehicles data in a dropdown menu so that users can select which vehicle to enter into the Rentals table:
SELECT 
	Vehicles.vehicleID,
	Makes.makeName,
	Models.modelName,
	Models.modelYear,
	Vehicles.mileage
FROM
	Vehicles
JOIN Makes ON Vehicles.makeID = Makes.makeID
JOIN Models ON Vehicles.modelID = Models.modelID;
-- Input data from database into Rentals Table:
INSERT INTO Rentals (vehicleID, startDate, endDate) VALUES (@${data.vehicleid}, @${data.startdate}, @${data.enddate});
-- Show Rentals table:
SELECT * FROM Rentals;
-- Input new user created data into Rentals Table:
INSERT INTO Rentals (vehicleID, startDate, endDate) VALUES (@${data['input-vehicleid']}, @${data['input-startdate']}, @${data['input-enddate']});



-- Vehicles Table
-- Display Rentals Table which includes location, make, model, and mileage data:
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
LEFT JOIN Locations ON Vehicles.locationID = Locations.locationID;
-- Show Locations data so that user can select location to input into Vehicles table through a dropdown menu:
SELECT * FROM Locations;
-- Show Makes data so that user can select make to input into Vehicles table through a dropdown menu:
SELECT * FROM Makes;
-- Show Models data so that user can select model to input into Vehicles table through a dropdown menu:
SELECT * FROM Models;
-- Input data from database into Vehicles Table:
INSERT INTO Vehicles (locationID, makeID, modelID, mileage) VALUES (@${data.locationid}, @${data.makeid}, @${data.modelid}, @${data.mileage});
-- Show Vehicles table:
SELECT * FROM Vehicles;
-- Input new user created data into Vehicles Table:
INSERT INTO Vehicles (locationID, makeID, modelID, mileage) VALUES (@${data['input-locationid']}, @${data['input-makeid']}, @${data['input-modelid']}, @${data['input-mileage']});
-- Update locationID (NULLable) in an entry of Vehicles by vehicleID:
UPDATE Vehicles SET  locationID= ? WHERE vehicleID = ?;



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
