CREATE OR REPLACE VIEW mob_android_users_View AS
SELECT 
    user_id AS user_id,
    user_name AS user_name,
    password AS password,
    mobileno  AS mobileno,
    emailid  AS emailid,
    'visitor' AS type,
    user_image_url,
    user_image_name,
    company_name as CompanyName
    
FROM Android_Users WHERE verified = 1

UNION ALL

SELECT 
    u.User_Id  AS user_id,
    u.User_Name  AS user_name,
    u.Password  AS password,
   u. User_Tel_No  AS mobileno,
u.User_Email  AS emailid,
    'host' AS type,
    '' AS user_image_url,
    '' AS user_image_name,
    c.Company_Name  As CompanyName
FROM Users u
inner join company c on u.Company_Id=c.Company_Id and c.Status=1 and u.Default_Role_Id<>5

UNION ALL

SELECT 
    u.User_Id  AS user_id,
    u.User_Name  AS user_name,
    u.Password  AS password,
   u. User_Tel_No  AS mobileno,
u.User_Email  AS emailid,
    'security' AS type,
    '' AS user_image_url,
    '' AS user_image_name,
    c.Company_Name  As CompanyName
FROM Users u
inner join company c on u.Company_Id=c.Company_Id and c.Status=1 and u.Default_Role_Id=5