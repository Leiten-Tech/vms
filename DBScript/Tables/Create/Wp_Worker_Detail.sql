CREATE TABLE IF NOT EXISTS `Wp_Worker_Detail` (
  `WP_Worker_Detail_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Work_Permit_Id` BIGINT NOT NULL,
  `Worker_Name` VARCHAR(255) NOT NULL,
  `Mail_Id` VARCHAR(255) NULL DEFAULT NULL,
  `Mobile_No` VARCHAR(255) NOT NULL,
  `Valid_From` DATETIME(6) NULL DEFAULT NULL,
  `Valid_To` DATETIME(6) NULL DEFAULT NULL,
  `Profile_Img_Name` VARCHAR(255) NULL,
  `Profile_Img_Url` VARCHAR(255) NULL,
  `Is_Incharge` BIGINT NOT NULL,
  `Is_Edited_Image` TINYINT(1) NULL DEFAULT 0,
  `Is_Working` TINYINT(1) NULL DEFAULT 0,
  `Status` INT NOT NULL,
  PRIMARY KEY (`WP_Worker_Detail_Id`),
  INDEX `fk_WP_Worker_Detail_Work_Permit_Id` (`Work_Permit_Id` ASC) ,
  CONSTRAINT `fk_WP_Worker_Detail_Work_Permit_Id`
    FOREIGN KEY (`Work_Permit_Id`)
    REFERENCES `Work_Permit` (`Work_Permit_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;