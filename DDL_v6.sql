-- MariaDB dump 10.19  Distrib 10.5.22-MariaDB, for Linux (x86_64)
--
-- Host: classmysql.engr.oregonstate.edu    Database: cs340_szetoja
-- ------------------------------------------------------
-- Server version	10.6.16-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Drivers`
--

DROP TABLE IF EXISTS `Drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Drivers` (
  `driverID` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `firstName` varchar(25) NOT NULL,
  `middleName` varchar(25) DEFAULT NULL,
  `lastName` varchar(25) NOT NULL,
  PRIMARY KEY (`driverID`)
) ENGINE=InnoDB AUTO_INCREMENT=636493 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Drivers`
--

LOCK TABLES `Drivers` WRITE;
/*!40000 ALTER TABLE `Drivers` DISABLE KEYS */;
INSERT INTO `Drivers` VALUES (1,'mylife239@gmail.com','James','Frank','White'),(2,'amy.roe.22@yahoo.com','Amy','Roe','Lee'),(3,'weezer7@aol.com','Joe',NULL,'Romero'),(4,'ilove1cake@gmail.com','Jenny',NULL,'Robinson');
/*!40000 ALTER TABLE `Drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DriversRentals`
--

DROP TABLE IF EXISTS `DriversRentals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DriversRentals` (
  `driversIDRentalsID` int(11) NOT NULL AUTO_INCREMENT,
  `driverID` int(11) NOT NULL,
  `rentalID` int(11) NOT NULL,
  PRIMARY KEY (`driversIDRentalsID`,`driverID`,`rentalID`),
  KEY `fk_DriversRentals_Drivers1_idx` (`driverID`),
  KEY `fk_DriversRentals_Rentals1_idx` (`rentalID`),
  CONSTRAINT `fk_DriversRentals_Drivers1` FOREIGN KEY (`driverID`) REFERENCES `Drivers` (`driverID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_DriversRentals_Rentals1` FOREIGN KEY (`rentalID`) REFERENCES `Rentals` (`rentalID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DriversRentals`
--

LOCK TABLES `DriversRentals` WRITE;
/*!40000 ALTER TABLE `DriversRentals` DISABLE KEYS */;
INSERT INTO `DriversRentals` VALUES (1,0,0),(2,0,0),(3,0,0),(4,0,0);
/*!40000 ALTER TABLE `DriversRentals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Locations`
--

DROP TABLE IF EXISTS `Locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Locations` (
  `locationID` int(11) NOT NULL,
  `city` varchar(30) NOT NULL,
  `state` varchar(30) NOT NULL,
  `address` varchar(100) NOT NULL,
  `locationVehicleCapacity` int(11) NOT NULL,
  PRIMARY KEY (`locationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Locations`
--

LOCK TABLES `Locations` WRITE;
/*!40000 ALTER TABLE `Locations` DISABLE KEYS */;
INSERT INTO `Locations` VALUES (1,'Los Angeles','California','232 Hollywood Blvd',40),(2,'New York','New York','1923 1st Street',50),(3,'New York','New York','1923 1st Street',50),(4,'Orlando','Florida','3934 Alligator Way',60),(7,'Walnut','CA','19311 Brooktrail Ln',1),(8,'Walnut','CA','19311 Brooktrail Ln',1);
/*!40000 ALTER TABLE `Locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Makes`
--

DROP TABLE IF EXISTS `Makes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Makes` (
  `makeID` int(11) NOT NULL AUTO_INCREMENT,
  `makeName` varchar(30) NOT NULL,
  PRIMARY KEY (`makeID`)
) ENGINE=InnoDB AUTO_INCREMENT=485445 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Makes`
--

LOCK TABLES `Makes` WRITE;
/*!40000 ALTER TABLE `Makes` DISABLE KEYS */;
INSERT INTO `Makes` VALUES (1,'Toyota'),(2,'Honda'),(3,'Honda'),(4,'Toyota');
/*!40000 ALTER TABLE `Makes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Models`
--

DROP TABLE IF EXISTS `Models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Models` (
  `modelID` int(11) NOT NULL AUTO_INCREMENT,
  `modelName` varchar(30) NOT NULL,
  `modelYear` int(11) NOT NULL,
  PRIMARY KEY (`modelID`)
) ENGINE=InnoDB AUTO_INCREMENT=485457 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Models`
--

LOCK TABLES `Models` WRITE;
/*!40000 ALTER TABLE `Models` DISABLE KEYS */;
INSERT INTO `Models` VALUES (1,'Sienna',2023),(2,'Accord',2021),(3,'Civic',2023),(4,'Sienna',2022);
/*!40000 ALTER TABLE `Models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rentals`
--

DROP TABLE IF EXISTS `Rentals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Rentals` (
  `rentalID` int(11) NOT NULL AUTO_INCREMENT,
  `vehicleID` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  PRIMARY KEY (`rentalID`,`vehicleID`),
  KEY `fk_Rentals_Vehicles1_idx` (`vehicleID`),
  CONSTRAINT `fk_Rentals_Vehicles1` FOREIGN KEY (`vehicleID`) REFERENCES `Vehicles` (`vehicleID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rentals`
--

LOCK TABLES `Rentals` WRITE;
/*!40000 ALTER TABLE `Rentals` DISABLE KEYS */;
INSERT INTO `Rentals` VALUES (1,1,'2023-10-03','2023-10-09'),(2,2,'2022-01-15','2022-01-16'),(3,3,'2024-01-01','2024-01-06'),(4,4,'2023-10-11','2023-10-16');
/*!40000 ALTER TABLE `Rentals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Vehicles`
--

DROP TABLE IF EXISTS `Vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Vehicles` (
  `vehicleID` int(11) NOT NULL AUTO_INCREMENT,
  `makeID` int(11) NOT NULL,
  `modelID` int(11) NOT NULL,
  `locationID` int(11) NOT NULL,
  `mileage` int(11) NOT NULL,
  PRIMARY KEY (`vehicleID`,`makeID`,`modelID`,`locationID`),
  KEY `fk_Vehicles_Models1_idx` (`modelID`),
  KEY `fk_Vehicles_Makes1_idx` (`makeID`),
  KEY `fk_Vehicles_Locations1_idx1` (`locationID`),
  CONSTRAINT `fk_Vehicles_Locations1` FOREIGN KEY (`locationID`) REFERENCES `Locations` (`locationID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Vehicles_Makes1` FOREIGN KEY (`makeID`) REFERENCES `Makes` (`makeID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_Vehicles_Models1` FOREIGN KEY (`modelID`) REFERENCES `Models` (`modelID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Vehicles`
--

LOCK TABLES `Vehicles` WRITE;
/*!40000 ALTER TABLE `Vehicles` DISABLE KEYS */;
INSERT INTO `Vehicles` VALUES (1,1,1,0,15451),(2,2,2,0,14625),(3,3,3,0,6512),(4,4,4,0,6444);
/*!40000 ALTER TABLE `Vehicles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-26 21:07:16
