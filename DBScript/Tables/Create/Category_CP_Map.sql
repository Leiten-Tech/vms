DROP TABLE IF EXISTS `Category_CP_Map`;
CREATE TABLE IF NOT EXISTS `Category_CP_Map` (
  `CP_Map_Id` INT NOT NULL AUTO_INCREMENT,
  `Category_Id` INT NOT NULL,
  `Category_Name` VARCHAR(100) NOT NULL,
  `Status` INT NOT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  `Is_Sys_Generated` BOOL NULL DEFAULT 0,
  PRIMARY KEY (`CP_Map_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

