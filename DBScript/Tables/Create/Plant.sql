CREATE TABLE IF NOT EXISTS `Plant` (
  `Plant_Id` BIGINT NOT NULL AUTO_INCREMENT,
  `Plant_Code` VARCHAR(50) NOT NULL,
  `Plant_Name` VARCHAR(255) NOT NULL,
  `Plant_Type` INT NOT NULL,
  `Address` LONGTEXT NULL DEFAULT NULL,
  `Geo_Location` LONGTEXT NOT NULL,
  `Country_Id` BIGINT NOT NULL,
  `city_Id` BIGINT NOT NULL,
  `State_Id` BIGINT NOT NULL,
  `Company_Id` BIGINT NOT NULL,
  `Status` INT NOT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  `URL_Token` LONGTEXT NULL DEFAULT NULL,
  `Check_Token` LONGTEXT NULL DEFAULT NULL,
  `Is_Automatic_Approve` boolean null,
  `Alert_After_Mins` DECIMAL(5,2) DEFAULT NULL,
  PRIMARY KEY (`Plant_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

