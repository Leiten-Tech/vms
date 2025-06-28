CREATE TABLE IF NOT EXISTS `VR_Worker_Docs` (
  `Company_Id` BIGINT NULL DEFAULT NULL,
  `Plant_Id` BIGINT NULL DEFAULT NULL,
  `Gate_Id` BIGINT NULL DEFAULT NULL,
  `VR_Worker_Doc_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `VR_Worker_Detail_Id` BIGINT NOT NULL,
  `Document_Name` VARCHAR(100) NOT NULL,
  `Document_Type` BIGINT NOT NULL,
  `Document_No` VARCHAR(100) NOT NULL,
  `Document_Url` VARCHAR(300) NULL DEFAULT NULL,
  `Remarks` VARCHAR(100) NULL DEFAULT NULL,
  `Status` BIGINT NOT NULL DEFAULT '74',
  PRIMARY KEY (`VR_Worker_Doc_Id`),
  INDEX `fk_VR_Worker_Docs_VR_Worker_Detail_Id` (`VR_Worker_Detail_Id` ASC) ,
  CONSTRAINT `fk_VR_Worker_Docs_VR_Worker_Detail_Id`
    FOREIGN KEY (`VR_Worker_Detail_Id`)
    REFERENCES `VR_Worker_Detail` (`VR_Worker_Detail_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;