CREATE TABLE IF NOT EXISTS `Approval` (
  `Approval_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Plant_Id` BIGINT NOT NULL,
  `Document_Id` BIGINT NOT NULL,
  `Document_No` VARCHAR(20) NOT NULL,
  `Status` INT NOT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  `Approval_Activity_Id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`Approval_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;