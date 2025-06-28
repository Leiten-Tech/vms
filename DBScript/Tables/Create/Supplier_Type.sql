CREATE TABLE IF NOT EXISTS `Supplier_Type` (
  `Supplier_Type_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Supplier_Type_Name` VARCHAR(255) NOT NULL,
  `Supplier_Type_Code` VARCHAR(20) NOT NULL,
  `Company_Id` BIGINT NOT NULL,
  `Plant_Id` BIGINT NOT NULL,
  `Status` INT NULL DEFAULT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Supplier_Type_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;