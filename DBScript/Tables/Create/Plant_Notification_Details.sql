CREATE TABLE IF NOT EXISTS `Plant_Notification_Details` (
  `Plant_Notification_Detail_Id` BIGINT AUTO_INCREMENT  NOT NULL,
  `Plant_Id` BIGINT NOT NULL,
  `Level_Id` INT  NULL,
  `Department_Id` BIGINT  NULL,
  `Primary_User_Id` BIGINT NULL,
  `Secondary_User_Id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`Plant_Notification_Detail_Id`),
  INDEX `fk_Plant_Plant_Id` (`Plant_Id` ASC),
  CONSTRAINT `fk_Plant_Plant_Id`
    FOREIGN KEY (`Plant_Id`)
    REFERENCES `Plant` (`Plant_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;