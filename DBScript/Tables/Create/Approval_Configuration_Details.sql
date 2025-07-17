CREATE TABLE IF NOT EXISTS `Approval_Configuration_Details` (
  `Approval_Configuration_Detail_Id` BIGINT AUTO_INCREMENT  NOT NULL,
  `Approval_Configuration_Id` BIGINT NOT NULL,
  `Level_Id` INT NOT NULL,
  `Role_Id` BIGINT NOT NULL,
  `Primary_User_Id` BIGINT NOT NULL,
  `Secondary_User_Id` BIGINT NULL DEFAULT NULL,
  `Is_Notify_Approve` tinyint default null,
  PRIMARY KEY (`Approval_Configuration_Detail_Id`),
  INDEX `fk_Approval_Configuration_Approval_Configuration_Id` (`Approval_Configuration_Id` ASC),
  CONSTRAINT `fk_Approval_Configuration_Approval_Configuration_Id`
    FOREIGN KEY (`Approval_Configuration_Id`)
    REFERENCES `Approval_Configuration` (`Approval_Configuration_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;