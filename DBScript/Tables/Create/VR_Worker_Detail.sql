CREATE TABLE IF NOT EXISTS `VR_Worker_Detail` (
  `VR_Worker_Detail_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Vendor_Reg_Id` BIGINT NOT NULL,
  `Worker_Name` VARCHAR(255) NOT NULL,
  `Mail_Id` VARCHAR(255) NULL DEFAULT NULL,
  `Mobile_No` VARCHAR(255) NOT NULL,
  `Is_Incharge` BIGINT NOT NULL,
  `Valid_From` DATETIME(6) NOT NULL,
  `Valid_To` DATETIME(6) NOT NULL,
  `Status` INT NOT NULL,
  PRIMARY KEY (`VR_Worker_Detail_Id`),
  INDEX `fk_VR_Worker_Detail_Vendor_Reg_Id` (`Vendor_Reg_Id` ASC) ,
  CONSTRAINT `fk_VR_Worker_Detail_Vendor_Reg_Id`
    FOREIGN KEY (`Vendor_Reg_Id`)
    REFERENCES `Vendor_Registration` (`Vendor_Reg_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;