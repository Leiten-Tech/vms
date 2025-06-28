CREATE TABLE IF NOT EXISTS `Visitor_Entry_Detail` (
  `Visitor_Entry_Detail_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Visitor_Entry_Id` BIGINT NOT NULL,
  `Visitor_Entry_Detail_Code` varchar(20) NOT NULL,
  `Visitor_Id` INT NOT NULL,
  `Title_id` INT NULL DEFAULT NULL,
  `First_Name` VARCHAR(255) NOT NULL,
  `Last_Name` VARCHAR(255) NOT NULL,
  `Department_Id` BIGINT NULL DEFAULT NULL,
  `Dob` DATETIME(6) NULL DEFAULT NULL,
  `Mail_Id` LONGTEXT NULL DEFAULT NULL,
  `Mobile_No` VARCHAR(255) NOT NULL,
  `Visitor_Company` LONGTEXT NULL DEFAULT NULL,
  `Tag_No` LONGTEXT NULL DEFAULT NULL,
  `Id_Card_Type` INT NULL DEFAULT NULL,
  `Id_Card_No` VARCHAR(255) NOT NULL,
  `Document_Name` LONGTEXT NOT NULL,
  `Document_Url` LONGTEXT NOT NULL,
  `Digital_Sign_Name` LONGTEXT NOT NULL,
  `Digital_Sign_URL` LONGTEXT NOT NULL,
  `Signed_Version` BIGINT NOT NULL,
  `Is_Terms_Agreed` BOOL NOT NULL DEFAULT FALSE,
  `Status` INT NOT NULL,
  `Is_Edited_Image` TINYINT(1) NULL DEFAULT NULL,
  `Valid_From` DATETIME(6) NULL DEFAULT NULL,
  `Valid_To` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Visitor_Entry_Detail_Id`),
  INDEX `fk_Visitor_Entry_Detail_Visitor_Entry_Id` (`Visitor_Entry_Id` ASC) ,
  CONSTRAINT `fk_Visitor_Entry_Detail_Visitor_Entry_Id`
    FOREIGN KEY (`Visitor_Entry_Id`)
    REFERENCES `Visitor_Entry` (`Visitor_Entry_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
