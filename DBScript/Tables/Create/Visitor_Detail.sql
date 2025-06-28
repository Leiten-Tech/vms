CREATE TABLE IF NOT EXISTS `Visitor_Detail` (
  `Visitor_Detail_Id` BIGINT AUTO_INCREMENT  NOT NULL,
  `Visitor_Id` BIGINT NOT NULL,
  `visitor_detail_Code` VARCHAR(20) NOT NULL,
  -- `visitor_detail_Code` VARCHAR(10) AS (CONCAT('VST', LPAD(Visitor_Detail_Id, 5, '0'))) STORED,
  `Title_id` INT NOT NULL,
  `First_Name` VARCHAR(255) NOT NULL,
  `Last_Name` VARCHAR(255) NOT NULL,
  `Department_Id` BIGINT NULL DEFAULT NULL,
  `Dob` DATETIME(6) NULL DEFAULT NULL,
  `Mail_Id` VARCHAR(255) NULL DEFAULT NULL,
  `Mobile_No` VARCHAR(255) NOT NULL,
  `Visitor_Company` LONGTEXT NULL DEFAULT NULL,
  `Tag_No` LONGTEXT NULL DEFAULT NULL,
  `Id_Card_Type` INT NOT NULL,
  `Id_Card_No` VARCHAR(255) NOT NULL,
  `Document_Name` LONGTEXT NOT NULL,
  `Document_Url` LONGTEXT NOT NULL,
  `Digital_Sign_Name` LONGTEXT NOT NULL,
  `Digital_Sign_URL` LONGTEXT NOT NULL,
  `Signed_Version` BIGINT NOT NULL,
  `Is_Terms_Agreed` BOOL NOT NULL DEFAULT FALSE,
  `Expirry_Date` DATETIME(6) NULL DEFAULT NULL,
  `WorkSeverity` INT NULL DEFAULT NULL,
  `Status` INT NOT NULL,
  PRIMARY KEY (`Visitor_Detail_Id`),
  INDEX `fk_Visitor_Detail_Visitor_Id` (`Visitor_Id` ASC) ,
  CONSTRAINT `fk_Visitor_Detail_Visitor_Id`
    FOREIGN KEY (`Visitor_Id`)
    REFERENCES `visitor` (`Visitor_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
