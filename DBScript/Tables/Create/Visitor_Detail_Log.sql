CREATE TABLE IF NOT EXISTS `Visitor_Detail_Log` (
  `Visitor_Detail_Log_Id` BIGINT AUTO_INCREMENT  NOT NULL,
  `Visitor_Detail_Id` BIGINT NOT NULL,
  `Visitor_Id` BIGINT NOT NULL,
  `Visitor_Log_Id` BIGINT NOT NULL,
  `Visitor_Detail_Code` VARCHAR(20) NOT NULL,
  `Title_id` INT NOT NULL,
  `First_Name` VARCHAR(255) NOT NULL,
  `Last_Name` VARCHAR(255) NOT NULL,
  `Department_Id` BIGINT NULL DEFAULT NULL,
  `Dob` DATETIME(6) NULL DEFAULT NULL,
  `Mail_Id` VARCHAR(255) NULL DEFAULT NULL,
  `Mobile_No` VARCHAR(255) NOT NULL,
  `Id_Card_Type` INT NOT NULL,
  `Id_Card_No` VARCHAR(255) NOT NULL,
  `Document_Name` LONGTEXT NOT NULL,
  `Document_Url` LONGTEXT NOT NULL,
  `Expirry_Date` DATETIME(6) NULL DEFAULT NULL,
  `WorkSeverity` INT NULL DEFAULT NULL,
  `Status` INT NOT NULL,
  `Tag_No` LONGTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`Visitor_Detail_Log_Id`),
  INDEX `fk_Visitor_Detail_Log_Visitor_Log_Id` (`Visitor_Log_Id` ASC),
  CONSTRAINT `fk_Visitor_Detail_Log_Visitor_Log_Id`
    FOREIGN KEY (`Visitor_Log_Id`)
    REFERENCES `Visitor_Log` (`Visitor_Log_Id`)

)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;