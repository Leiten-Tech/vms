CREATE TABLE IF NOT EXISTS UserDeviceTokens (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    MobileNumber VARCHAR(15) UNIQUE,   -- Mobile number is unique
    DeviceToken VARCHAR(255),           -- Store the FCM device token
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP -- Timestamp of when the token was saved
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;