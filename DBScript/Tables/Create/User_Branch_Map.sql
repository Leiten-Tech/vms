CREATE TABLE IF NOT EXISTS `User_Branch_Map` (
  `User_Branch_Map_Id` BIGINT NOT NULL AUTO_INCREMENT,
  `Company_Id` BIGINT NOT NULL,
  `User_Id` BIGINT NOT NULL,
  `Plant_Id` BIGINT NOT NULL,
  `Status` INT NOT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  `Accounting_Year` INT NOT NULL,
  `Is_Default` BOOL NULL DEFAULT NULL,
  PRIMARY KEY (`User_Branch_Map_Id`),
  INDEX `fk_Users_User_Id` (`User_Id` ASC) ,
  CONSTRAINT `fk_Users_User_Id`
    FOREIGN KEY (`User_Id`)
    REFERENCES `Users` (`User_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
