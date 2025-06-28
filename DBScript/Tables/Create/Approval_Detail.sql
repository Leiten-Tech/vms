CREATE TABLE IF NOT EXISTS `Approval_Detail` (
  `Approval_Detail_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Approval_Id` BIGINT NOT NULL,
  `Document_Id` BIGINT NOT NULL,
  `Document_No` VARCHAR(20) NOT NULL,
  `Level_Id` INT NOT NULL,
  `Primary_User_Id` BIGINT NOT NULL,
  `Secondary_User_Id` BIGINT NULL DEFAULT NULL,
  `Is_Viewed` BOOLEAN NULL DEFAULT NULL,
  `Status` INT NOT NULL,
  `Remarks1` VARCHAR(500) NULL DEFAULT NULL,
  `Remarks2` VARCHAR(500) NULL DEFAULT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Approval_Detail_Id`),
  INDEX `fk_Approval_Approval_Id` (`Approval_Id` ASC) ,
  CONSTRAINT `fk_Approval_Approval_Id`
    FOREIGN KEY (`Approval_Id`)
    REFERENCES `Approval` (`Approval_Id`)
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
