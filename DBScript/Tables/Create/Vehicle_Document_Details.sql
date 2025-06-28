CREATE TABLE IF NOT EXISTS `Vehicle_Document_Details` (
  `Vehicle_Document_Detail_Id` BIGINT NOT NULL AUTO_INCREMENT,
  `Vehicle_Id` BIGINT NOT NULL,
  `Document_Name` VARCHAR(100) NOT NULL,
  `Document_No` VARCHAR(100) NOT NULL,
  `Attachment_Url` VARCHAR(300) NULL DEFAULT NULL,
  `Attachment_Name` VARCHAR(300) NULL DEFAULT NULL,
  `Remarks` VARCHAR(500) NULL DEFAULT NULL,
  PRIMARY KEY (`Vehicle_Document_Detail_Id`),
  INDEX `fk_Vehicle_Vehicle_Id` (`Vehicle_Id` ASC) ,
  CONSTRAINT `fk_Vehicle_Vehicle_Id`
    FOREIGN KEY (`Vehicle_Id`)
    REFERENCES `Vehicle` (`Vehicle_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;