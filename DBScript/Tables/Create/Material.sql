CREATE TABLE IF NOT EXISTS `Material` (
  `Material_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Material_Code` VARCHAR(50) NOT NULL,
  `Material_Type` BIGINT NOT NULL,
  `Material_Category_Id` BIGINT NOT NULL,
  `Material_Sub_Category_Id` BIGINT NOT NULL,
  `Material_Name` VARCHAR(100) NOT NULL,
  `Brand_Name` VARCHAR(100) NOT NULL,
  `Purchase_Price` DECIMAL(19,5) NOT NULL,
  `Material_Image_Name` LONGTEXT NULL DEFAULT NULL,
  `Material_Image_Url` LONGTEXT NULL DEFAULT NULL,
  `Status` INT NULL DEFAULT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  `Uom` INT NOT NULL DEFAULT '3',
  PRIMARY KEY (`Material_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

