CREATE TABLE IF NOT EXISTS `Wp_Category_Detail` (
  `Company_Id` BIGINT NULL DEFAULT NULL,
  `Plant_Id` BIGINT NULL DEFAULT NULL,
  `Gate_Id` BIGINT NULL DEFAULT NULL,
  `WP_Category_Detail_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Work_Permit_Id` BIGINT NOT NULL,
  `Category_Id` BIGINT NOT NULL,
  `Category_Name` VARCHAR(100) NOT NULL,
  `Remark_Status` BIGINT NOT NULL,
  PRIMARY KEY (`WP_Category_Detail_Id`),
  INDEX `fk_Wp_Category_Detail_Work_Permit_Id` (`Work_Permit_Id` ASC) ,
  CONSTRAINT `fk_Wp_Category_Detail_Work_Permit_Id`
    FOREIGN KEY (`Work_Permit_Id`)
    REFERENCES `Work_permit` (`Work_Permit_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;