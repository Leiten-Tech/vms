CREATE TABLE IF NOT EXISTS `Driver` (
  `Driver_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Driver_Code` VARCHAR(50) NOT NULL,
  `Emp_Id` BIGINT NOT NULL,
  `Supp_Id` BIGINT NOT NULL,
  `Dob` DATETIME(6) NOT NULL,
  `Age` INT NOT NULL,
  `Driving_Licence_No` VARCHAR(50) NOT NULL,
  `License_Validity` DATETIME(6) NOT NULL,
  `Heavy_Batch_No` VARCHAR(50) NOT NULL,
  `Batch_Validity` DATETIME(6) NOT NULL,
  `Driver_Mobile_No` INT NOT NULL,
  `National_Id_No` VARCHAR(50) NOT NULL,
  `Contact_Address` VARCHAR(150) NOT NULL,
  `Emergency_Contact_Name` VARCHAR(50) NOT NULL,
  `Emergency_Contact_No` INT NOT NULL,
  `Document_Refrence_Name` LONGTEXT NOT NULL,
  `Upload_Document` LONGTEXT NOT NULL,
  `Status` INT NOT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Driver_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;

