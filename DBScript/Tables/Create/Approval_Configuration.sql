CREATE TABLE IF NOT EXISTS `Approval_Configuration` (
  `Approval_Configuration_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Company_Id` BIGINT NOT NULL,
  `Plant_Id` BIGINT NOT NULL,
  `Document_Id` BIGINT NOT NULL,
  `Approval_Activity_Id` INT NOT NULL,
  `Status` INT NOT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`Approval_Configuration_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;