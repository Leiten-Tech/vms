CREATE TABLE IF NOT EXISTS `Visitor_Entry_Log` (
  `Visitor_Entry_Log_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Visitor_Entry_Detail_Id` BIGINT NOT NULL,
  `Visitor_Entry_Code` LONGTEXT NOT NULL,
  `Checked_In` DATETIME(6) NOT NULL,
  `Checked_Out` DATETIME(6) NULL DEFAULT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Visitor_Entry_Log_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;