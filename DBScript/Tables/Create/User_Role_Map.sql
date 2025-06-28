CREATE TABLE IF NOT EXISTS `User_Role_Map` (
  `User_Role_Map_Id` BIGINT NOT NULL AUTO_INCREMENT,
  `Company_Id` SMALLINT NOT NULL,
  `User_Id` BIGINT NOT NULL,
  `Role_Id` SMALLINT NOT NULL,
  `Status` INT NOT NULL,
  `Accounting_Year` BIGINT NOT NULL,
  `Is_Default` BOOL NULL DEFAULT NULL,
  PRIMARY KEY (`User_Role_Map_Id`),
  INDEX `fk_User_Roll_Map_User_Id` (`User_Id` ASC) ,
  CONSTRAINT `fk_User_Roll_Map_User_Id`
    FOREIGN KEY (`User_Id`)
    REFERENCES `Users` (`User_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;