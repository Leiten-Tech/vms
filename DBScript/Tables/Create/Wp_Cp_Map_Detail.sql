CREATE TABLE IF NOT EXISTS `Wp_Cp_Map_Detail` (
  `Company_Id` BIGINT NULL DEFAULT NULL,
  `Plant_Id` BIGINT NULL DEFAULT NULL,
  `Gate_Id` BIGINT NULL DEFAULT NULL,
  `Wp_Cp_Map_Detail_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Work_Permit_Id` BIGINT NOT NULL,
  `Category_Id` BIGINT NOT NULL,
  `Cp_Des` VARCHAR(500) NOT NULL,
  `Cp_Map_Id` BIGINT NOT NULL,
  `Remarks` BIGINT NULL,
  PRIMARY KEY (`WP_Cp_Map_Detail_Id`),
  INDEX `fk_WP_Cp_Map_Detail_Work_Permit_Id` (`Work_Permit_Id` ASC) ,
  CONSTRAINT `fk_WP_Cp_Map_Detail_Work_Permit_Id`
    FOREIGN KEY (`Work_Permit_Id`)
    REFERENCES `Work_permit` (`Work_Permit_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;