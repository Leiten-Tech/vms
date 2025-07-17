CREATE TABLE IF NOT EXISTS `Notification` (
    `Notification_Id` BIGINT AUTO_INCREMENT NOT NULL,
	`Company_Id` BIGINT NULL DEFAULT NULL,
    `Plant_Id` BIGINT NULL DEFAULT NULL,
    `Gate_Id` BIGINT NULL DEFAULT NULL,
    `Entry_Code` VARCHAR(50) NULL,
    `Visitor_Id` BIGINT NULL DEFAULT NULL,
    `Incharge_Id` BIGINT NULL DEFAULT NULL,
    `Visitor_Name` VARCHAR(100),
    `Mobile_No` VARCHAR(15) NOT NULL,
    `Mail_Id` VARCHAR(500) NULL,
    `Notification_Sent` BOOL DEFAULT FALSE,
    `Sent_Timestamp` DATETIME,
	`Created_By` INT NULL,
    `Created_On` DATETIME(6) NOT NULL,
    `Modified_By` INT NULL DEFAULT NULL,
    `Modified_On` DATETIME(6) NULL DEFAULT NULL,
    `Status` INT NULL DEFAULT NULL,
    `Notification_Type` BIGINT NULL,
  PRIMARY KEY (`Notification_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;