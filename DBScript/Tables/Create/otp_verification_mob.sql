CREATE TABLE IF NOT EXISTS `otp_verification_mob` (
    `verification_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `verification_type` VARCHAR(15) NOT NULL,
    `verification_no` VARCHAR(100) NOT NULL,
    `otp_code` VARCHAR(10) NOT NULL,
    `expiry_at` DATETIME NOT NULL,
    `status` TINYINT NOT NULL,
    PRIMARY KEY (`verification_id`),
    INDEX (`verification_no`)
) 
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
