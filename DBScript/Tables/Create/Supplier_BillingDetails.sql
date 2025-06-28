
CREATE TABLE IF NOT EXISTS `Supplier_BillingDetails` (
  `Supplier_Billing_Id` BIGINT AUTO_INCREMENT NOT NULL,
  `Supplier_Id` BIGINT NOT NULL,
  `Company_Id` BIGINT NOT NULL,
  `Plant_Id` BIGINT NOT NULL,
  `Billing_Address_One` VARCHAR(300) NOT NULL,
  `Billing_Address_Two` VARCHAR(300) NOT NULL,
  `City_Id` BIGINT NOT NULL,
  `State_Id` BIGINT NOT NULL,
  `Country_Id` BIGINT NOT NULL,
  `Billing_Pincode` VARCHAR(10) NOT NULL,
  `Billing_ContactPerson` VARCHAR(255) NOT NULL,
  `Billing_Phone_One` VARCHAR(50) NOT NULL,
  `Billing_Phone_Two` VARCHAR(50) NOT NULL,
  `Billing_MobileNo` VARCHAR(50) NOT NULL,
  `Billing_Mail_Id` VARCHAR(50) NOT NULL,
  `status` INT NULL DEFAULT NULL,
  `Created_By` INT NOT NULL,
  `Created_On` DATETIME(6) NOT NULL,
  `Modified_By` INT NULL DEFAULT NULL,
  `Modified_On` DATETIME(6) NULL DEFAULT NULL,
  `Document_Name` LONGTEXT NOT NULL,
  `Document_Url` LONGTEXT NOT NULL,
  PRIMARY KEY (`Supplier_Billing_Id`),
  INDEX `fk_Supplier_BillingDetails_Supplier_Id` (`Supplier_Id` ASC) ,
  CONSTRAINT `fk_Supplier_BillingDetails_Supplier_Id`
    FOREIGN KEY (`Supplier_Id`)
    REFERENCES `Supplier` (`Supplier_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;