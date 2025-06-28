CREATE TABLE IF NOT EXISTS `Category_CP_Map_Details` (
  `Category_CP_Map_Detail_Id` BIGINT NOT NULL AUTO_INCREMENT,
  `CP_Map_Id` INT NOT NULL,
  `Category_Id` INT NOT NULL,
  `Description` VARCHAR(500) NOT NULL,
  `Status` INT NOT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  `Is_Sys_Generated` BOOL NULL DEFAULT 0,
  PRIMARY KEY (`Category_CP_Map_Detail_Id`),
  INDEX `fk_Category_CP_Map_CP_Map_Id` (`CP_Map_Id` ASC) ,
  CONSTRAINT `fk_Category_CP_Map_CP_Map_Id`
    FOREIGN KEY (`CP_Map_Id`)
    REFERENCES `Category_CP_Map` (`CP_Map_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
