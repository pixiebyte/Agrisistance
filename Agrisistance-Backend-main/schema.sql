CREATE DATABASE AgricultureData;

USE AgricultureData;

-- Users Table
CREATE TABLE `Users` (
    `user_id` VARCHAR(36) NOT NULL,
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `country` VARCHAR(50) NOT NULL,
    `role` VARCHAR(10) NOT NULL,
    `phoneNumber` VARCHAR(15) NOT NULL,
    `eMail` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `profile_picture` VARCHAR(255) DEFAULT NULL,
    `subscription_type` VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `email` (`eMail`)
);

-- Soil_Data Table
CREATE TABLE `Soil_Data` (
    `soil_id` INT PRIMARY KEY AUTO_INCREMENT,
    `latitude` FLOAT NOT NULL,
    `longitude` FLOAT NOT NULL,
    `land_size` FLOAT NOT NULL,
    `ph_level` FLOAT NOT NULL,
    `nitrogen` FLOAT NOT NULL,
    `phosphorus` FLOAT NOT NULL,
    `potassium` FLOAT NOT NULL,
    `porosity` VARCHAR(100) NOT NULL,
    `oxygen_level` VARCHAR(100) NOT NULL,
    `user_id` VARCHAR(36),
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`)
); 

-- Weather_Data Table
CREATE TABLE `Weather_Data` (
    `weather_id` INT PRIMARY KEY AUTO_INCREMENT,
    `temperature` FLOAT NOT NULL,
    `humidity` FLOAT NOT NULL,
    `rainfall` FLOAT NOT NULL,
    `soil_id` INT,
    FOREIGN KEY (`soil_id`) REFERENCES `Soil_Data`(`soil_id`)
);

-- Pest_Data Table
CREATE TABLE `Pest_Data` (
    `pest_id` INT PRIMARY KEY AUTO_INCREMENT,
    `species` VARCHAR(100) NOT NULL,
    `infestation_level` VARCHAR(50) NOT NULL,
    `soil_id` INT,
    FOREIGN KEY (`soil_id`) REFERENCES `Soil_Data`(`soil_id`)
);

-- Recommendations Table
CREATE TABLE `Recommendations` (
    `rec_id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` VARCHAR(36),
    `soil_id` INT,
    `weather_id` INT,
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`),
    FOREIGN KEY (`soil_id`) REFERENCES `Soil_Data`(`soil_id`),
    FOREIGN KEY (`weather_id`) REFERENCES `Weather_Data`(`weather_id`)
);

CREATE TABLE `crop_types`(  
    `crop_id` INT PRIMARY KEY AUTO_INCREMENT,
    `crop_type` VARCHAR(30) NOT NULL,
    `rec_id` INT NOT NULL,
    FOREIGN KEY (`rec_id`) REFERENCES `Recommendations`(`rec_id`)   
);

-- Yield_Predictions Table
CREATE TABLE `Yield_Predictions` (
    `yield_id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` VARCHAR(36),
    `crop_type` VARCHAR(100) NOT NULL,
    `predicted_yield` FLOAT NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`)
);

-- Financial_Data Table
CREATE TABLE `Financial_Data` (
    `financial_id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` VARCHAR(36),
    `investment_amount` FLOAT NOT NULL,
    `expected_revenue` FLOAT NOT NULL,
    `current_revenue` FLOAT NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`)
);
