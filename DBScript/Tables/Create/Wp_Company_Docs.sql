CREATE TABLE IF NOT EXISTS `Wp_Company_Docs` (
  `Company_Id` BIGINT NULL DEFAULT NULL,
  `Plant_Id` BIGINT NULL DEFAULT NULL,
  `Gate_Id` BIGINT NULL DEFAULT NULL,
  `WP_Company_Doc_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Work_Permit_Id` BIGINT NOT NULL,
  `Document_Name` VARCHAR(100) NOT NULL,
  `Document_Type` BIGINT NOT NULL,
  `Document_No` VARCHAR(100) NOT NULL,
  `Document_Url` VARCHAR(300) NULL DEFAULT NULL,
  `Remarks` VARCHAR(100) NULL DEFAULT NULL,
  `Status` BIGINT NOT NULL DEFAULT '74',
  PRIMARY KEY (`WP_Company_Doc_Id`),
  INDEX `fk_WP_Company_Docs_Work_Permit_Id` (`Work_Permit_Id` ASC) ,
  CONSTRAINT `fk_WP_Company_Docs_Work_Permit_Id`
    FOREIGN KEY (`Work_Permit_Id`)
    REFERENCES `Work_permit` (`Work_Permit_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;