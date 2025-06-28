CREATE TABLE IF NOT EXISTS `Employee_Document_Details` (
  `Employee_Document_Detail_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Employee_Id` BIGINT NOT NULL,
  `Document_Name` VARCHAR(100) NOT NULL,
  `Document_No` VARCHAR(100) NOT NULL,
  `Attachment_Url` VARCHAR(300) NULL DEFAULT NULL,
  `Attachment_Name` VARCHAR(300) NULL DEFAULT NULL,
  `Remarks` VARCHAR(500) NULL DEFAULT NULL,
  PRIMARY KEY (`Employee_Document_Detail_Id`),
  INDEX `fk_Employee_Employee_Id` (`Employee_Id` ASC) ,
  CONSTRAINT `fk_Employee_Employee_Id`
    FOREIGN KEY (`Employee_Id`)
    REFERENCES `Employee` (`Employee_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
