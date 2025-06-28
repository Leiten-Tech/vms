CREATE TABLE IF NOT EXISTS `Instructions` (
  `Instructions_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Company_Id` BIGINT NULL,
  `Plant_Id` BIGINT NULL,
  `Instruction_Name` VARCHAR(50) NOT NULL,
  `Visitor_Type_Id` BIGINT NOT NULL,
  `Points` LONGTEXT NOT NULL,
  `Version` BIGINT NOT NULL,
  `Is_Enabled` BOOL NOT NULL DEFAULT FALSE,
  `Status` INT NULL DEFAULT NULL,
  PRIMARY KEY (`Instructions_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
