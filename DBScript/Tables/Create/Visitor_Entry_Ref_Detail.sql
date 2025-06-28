CREATE TABLE IF NOT EXISTS `Visitor_Entry_Ref_Detail` (
  `Visitor_Entry_Ref_Detail_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Visitor_Entry_Id` BIGINT NULL,
  `Ref_Type_Id` BIGINT NULL,
  `Ref_Value` VARCHAR(50) NULL,
  PRIMARY KEY (`Visitor_Entry_Ref_Detail_Id`),
  INDEX `fk_Visitor_Entry_Ref_Detail_Visitor_Entry_Id` (`Visitor_Entry_Id` ASC) ,
  CONSTRAINT `fk_Visitor_Entry_Ref_Detail_Visitor_Entry_Id`
    FOREIGN KEY (`Visitor_Entry_Id`)
    REFERENCES `Visitor_Entry` (`Visitor_Entry_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;