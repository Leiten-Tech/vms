CREATE TABLE IF NOT EXISTS `Function_Role_Map` (
  `Function_Role_Map_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Role_Id` BIGINT NULL DEFAULT NULL,
  `Function_Id` BIGINT NULL DEFAULT NULL,
  `Company_Id` BIGINT NOT NULL,
  `Plant_Id` BIGINT NOT NULL,
  `Status` INT NOT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Function_Role_Map_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
