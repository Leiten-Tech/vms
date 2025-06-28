CREATE TABLE IF NOT EXISTS `Country` (
  `Country_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Country_Name` VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  `Country_Code` VARCHAR(50) NULL DEFAULT NULL,
  `Country_Short_Form` VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  `Nationality` VARCHAR(100) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_general_ci' NOT NULL,
  `Status` INT NULL DEFAULT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Country_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;