CREATE TABLE IF NOT EXISTS `Gate_Detail` (
  `Gate_Detail_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Security_Id` BIGINT NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `Phone_Number` VARCHAR(100) NOT NULL,
  `Gate_Id` BIGINT NOT NULL,
  `Address` VARCHAR(500) NULL DEFAULT NULL,
  PRIMARY KEY (`Gate_Detail_Id`),
  INDEX `fk_Gate_Detail_Gate_Id` (`Gate_Id` ASC) ,
  CONSTRAINT `fk_Gate_Detail_Gate_Id`
    FOREIGN KEY (`Gate_Id`)
    REFERENCES `Gate` (`Gate_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;