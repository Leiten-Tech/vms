CREATE TABLE IF NOT EXISTS `Wp_Worker_Docs` (
  `Company_Id` BIGINT NULL DEFAULT NULL,
  `Plant_Id` BIGINT NULL DEFAULT NULL,
  `Gate_Id` BIGINT NULL DEFAULT NULL,
  `WP_Worker_Doc_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `WP_Worker_Detail_Id` BIGINT NOT NULL,
  `Document_Name` VARCHAR(100) NOT NULL,
  `Document_Type` BIGINT NOT NULL,
  `Document_No` VARCHAR(100) NOT NULL,
  `Document_Url` VARCHAR(300) NULL DEFAULT NULL,
  `Remarks` VARCHAR(100) NULL DEFAULT NULL,
  `Status` BIGINT NOT NULL DEFAULT '74',
  PRIMARY KEY (`WP_Worker_Doc_Id`),
  INDEX `fk_WP_Worker_Docs_WP_Worker_Detail_Id` (`WP_Worker_Detail_Id` ASC) ,
  CONSTRAINT `fk_WP_Worker_Docs_WP_Worker_Detail_Id`
    FOREIGN KEY (`WP_Worker_Detail_Id`)
    REFERENCES `Wp_Worker_Detail` (`WP_Worker_Detail_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;