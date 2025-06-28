create table if not exists `License_Configuration`(
	`License_Id` BIGINT AUTO_INCREMENT NOT NULL,
    `Company_Id` BIGINT NOT NULL,
    `Company_Code` varchar(500) NOT NULL,
    `Company_Name` varchar(500) NOT NULL,
    `Trial_Start_Date` datetime NOT NULL,
    `Trial_End_Date` datetime NOT NULL,
    `Trial_Total_Days` BIGINT NOT NULL,
    `Is_WA_Approval_Enabled` BOOL DEFAULT FALSE NOT NULL,
    `Is_EM_Approval_Enabled` BOOL DEFAULT FALSE NOT NULL,
    `License_Token` varchar(500) NOT NULL,
    `Status` INT NOT NULL,
PRIMARY KEY (`License_Id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;