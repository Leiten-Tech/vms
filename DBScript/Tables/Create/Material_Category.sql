CREATE TABLE IF NOT EXISTS `Material_Category` (
  `Material_Category_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Material_Category_Name` VARCHAR(255) NOT NULL,
  `Status` INT NOT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Material_Category_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;