CREATE TABLE IF NOT EXISTS `Feedback_Detail` (
  `Feedback_Detail_Id` BIGINT AUTO_INCREMENT  NOT NULL,
  `Company_Id` BIGINT NULL DEFAULT NULL,
  `Plant_Id` BIGINT NULL DEFAULT NULL,
  `Feedback_Id` BIGINT NULL DEFAULT NULL,
  `Feedback_Type` BIGINT NULL DEFAULT NULL,
  `Star_Rating` BIGINT NULL DEFAULT NULL,
  `Status` INT NULL DEFAULT NULL,
  PRIMARY KEY (`Feedback_Detail_Id`),
  INDEX `fk_Feedback_Detail_Feedback_Id` (`Feedback_Id` ASC),
  CONSTRAINT `fk_Feedback_Detail_Feedback_Id`
    FOREIGN KEY (`Feedback_Id`)
    REFERENCES `Feedback` (`Feedback_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;