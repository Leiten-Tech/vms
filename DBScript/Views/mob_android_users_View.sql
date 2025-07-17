CREATE OR REPLACE VIEW mob_android_users_View AS
SELECT 
    user_id COLLATE utf8mb4_general_ci AS user_id,
    user_name COLLATE utf8mb4_general_ci AS user_name,
    password COLLATE utf8mb4_general_ci AS password,
    mobileno COLLATE utf8mb4_general_ci AS mobileno,
    emailid COLLATE utf8mb4_general_ci AS emailid,
    'visitor' AS type,
    user_image_url,
    user_image_name,
    company_name as CompanyName
    
FROM Android_Users WHERE verified = 1

UNION ALL

SELECT 
    u.User_Id COLLATE utf8mb4_general_ci AS user_id,
    u.User_Name COLLATE utf8mb4_general_ci AS user_name,
    u.Password COLLATE utf8mb4_general_ci AS password,
   u. User_Tel_No COLLATE utf8mb4_general_ci AS mobileno,
u.User_Email COLLATE utf8mb4_general_ci AS emailid,
    'host' AS type,
    '' AS user_image_url,
    '' AS user_image_name,
    c.Company_Name COLLATE utf8mb4_general_ci As CompanyName
FROM Users u
inner join company c on u.Company_Id=c.Company_Id and c.Status=1 and u.Default_Role_Id<>5

UNION ALL

SELECT 
    u.User_Id COLLATE utf8mb4_general_ci AS user_id,
    u.User_Name COLLATE utf8mb4_general_ci AS user_name,
    u.Password COLLATE utf8mb4_general_ci AS password,
   u. User_Tel_No COLLATE utf8mb4_general_ci AS mobileno,
u.User_Email COLLATE utf8mb4_general_ci AS emailid,
    'security' AS type,
    '' AS user_image_url,
    '' AS user_image_name,
    c.Company_Name COLLATE utf8mb4_general_ci As CompanyName
FROM Users u
inner join company c on u.Company_Id=c.Company_Id and c.Status=1 and u.Default_Role_Id=5