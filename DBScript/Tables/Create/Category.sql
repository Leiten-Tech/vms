DROP TABLE IF EXISTS `Category`;
CREATE TABLE IF NOT EXISTS `Category` (
  `Category_Id` INT NOT NULL AUTO_INCREMENT,
  `Category_Name` VARCHAR(100) NOT NULL,
  `Status` INT NOT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  `Is_Sys_Generated` BIT NULL,
  PRIMARY KEY (`Category_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

