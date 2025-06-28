CREATE TABLE IF NOT EXISTS `Metadata` (
  `Meta_Sub_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Meta_Type_Code` VARCHAR(30) NOT NULL,
  `Meta_Sub_Code` VARCHAR(30) NOT NULL,
  `Meta_Type_Name` VARCHAR(50) NOT NULL,
  `Meta_Sub_Description` VARCHAR(100) NOT NULL,
  `Status` INT NOT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Meta_Sub_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;