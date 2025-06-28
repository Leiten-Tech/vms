CREATE TABLE IF NOT EXISTS `Wp_Approval_Detail` (
  `Wp_Approval_Detail_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Work_Permit_Id` BIGINT NOT NULL,
  `Dept_Id` BIGINT NOT NULL,
  `Level_Id` INT NOT NULL,
  `Primary_User_Id` BIGINT NOT NULL,
  `Secondary_User_Id` BIGINT NULL DEFAULT NULL,
  `Digital_Sign` VARCHAR(500) NULL DEFAULT NULL,
  `Digital_Sign_Url` VARCHAR(500) NULL DEFAULT NULL,
  `Status` INT NOT NULL,
  `Remarks1` VARCHAR(500) NULL DEFAULT NULL,
  `Remarks2` VARCHAR(500) NULL DEFAULT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Wp_Approval_Detail_Id`),
  INDEX `fk_Wp_Approval_Detail_Wp_Approval_Detail_Id` (`Work_Permit_Id` ASC) ,
  CONSTRAINT `fk_Wp_Approval_Detail_Wp_Approval_Detail_Id`
    FOREIGN KEY (`Work_Permit_Id`)
    REFERENCES `Work_Permit` (`Work_Permit_Id`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;


