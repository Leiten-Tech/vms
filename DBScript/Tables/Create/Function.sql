CREATE TABLE IF NOT EXISTS `Function` (
  `Function_Id` INT AUTO_INCREMENT NOT NULL,
  `Function_Name` VARCHAR(100) NOT NULL,
  `Function_Url` VARCHAR(300) NULL DEFAULT NULL,
  `Parent_Id` INT NOT NULL,
  `Function_Status` SMALLINT NOT NULL,
  `Screen_Order` INT NOT NULL,
  `Is_External` BOOL NOT NULL,
  `Is_Approval_Needed` INT NOT NULL,
  `Status` INT NOT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  `menu_Icon` LONGTEXT NULL DEFAULT NULL,
  `rel_link` LONGTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`Function_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
