CREATE TABLE IF NOT EXISTS `VR_Company_Docs` (
  `Company_Id` BIGINT NULL DEFAULT NULL,
  `Plant_Id` BIGINT NULL DEFAULT NULL,
  `Gate_Id` BIGINT NULL DEFAULT NULL,
  `VR_Company_Doc_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Vendor_Reg_Id` BIGINT NOT NULL,
  `Document_Name` VARCHAR(100) NOT NULL,
  `Document_Type` BIGINT  NULL,
  `Document_No` VARCHAR(100) NOT NULL,
  `Document_Url` VARCHAR(300) NULL DEFAULT NULL,
  `Remarks` VARCHAR(100) NULL DEFAULT NULL,
  `Status` BIGINT NOT NULL DEFAULT '74',
  PRIMARY KEY (`VR_Company_Doc_Id`),
  INDEX `fk_VR_Company_Docs_Vendor_Reg_Id` (`Vendor_Reg_Id` ASC) ,
  CONSTRAINT `fk_VR_Company_Docs_Vendor_Reg_Id`
    FOREIGN KEY (`Vendor_Reg_Id`)
    REFERENCES `Vendor_Registration` (`Vendor_Reg_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;