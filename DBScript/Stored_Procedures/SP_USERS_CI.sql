DELIMITER //

DROP PROCEDURE IF EXISTS SP_USERS_CI;
CREATE PROCEDURE SP_USERS_CI  
(  
	IN Type longtext,    
	IN userId int,    
	IN CompanyId bigint,    
	IN PlantId bigint,
	IN SchemeEmp longtext,      
	IN SchemeUser longtext,
    IN SchemeUserDSign longtext,
	IN NewUserId int,
	IN RoleId int
)
BEGIN    
 if(Type='CreateInitialize')      
 then
 select*from Metadata where Meta_Type_Code = 'STA';    
 -- select    
 -- Employee_Id,     
 -- Plant_Id,    
 -- Employee_Code,    
 -- First_Name+' '+Last_Name+' ('+Employee_Code+' )' First_Name,    
 -- Last_Name,    
 -- Dob,    
 -- Age,    
 -- Designation_Id,    
 -- Dept_Id,    
 -- Email,    
 -- Primary_Mobile_No,    
 -- Secondary_Mobile_No,    
 -- Marital_Status,    
 -- Gender,    
 -- Emp_Type_Id,    
 -- Biometric_Id,    
 -- Idcard_No,    
 -- Blood_Group,    
 -- Date_Of_Joining,    
 -- Releaving_Date,    
 -- Reporting_Person,    
 -- Address,    
 -- Image_Name,    
 -- case when Image_Name is not null then  SchemeEmp+Image_Name else null end as ImageUrl,    
 -- Status,    
 -- Created_By,    
 -- Created_On,    
 -- Modified_By,    
 -- Modified_On    
 -- from Employee with(nolock) where Status=1  
 
-- 	 IF RoleId = 1 THEN
--         SELECT *
--         FROM Company c
--         WHERE c.Status = 1;
    -- ELSE
        SELECT *
        FROM Company c
        WHERE c.Status = 1
        AND c.Company_Id = CompanyId and c.Check_Token is not null and c.Check_Token != "";
    -- END IF;
 
--    IF RoleId = 1 THEN
--        SELECT
-- 		*,
-- 		CASE 
-- 			WHEN r.Role_Name IS NOT NULL 
-- 			THEN CONCAT(r.Role_Name, ' (', c.Company_Name, ')') 
-- 			ELSE NULL 
-- 		END AS Role_Name
-- 		FROM 
-- 			Role r
-- 		LEFT JOIN 
-- 			Company c ON c.Company_Id = r.Company_Id
-- 		WHERE 
-- 			r.Status = 1;

--     ELSE
        select
		 *
		 from 
		 Role r
		 where r.Status=1 and r.Company_Id = CompanyId;
    -- END IF;
    
--     IF RoleId = 1 THEN
--          
--          SELECT
-- 		*,
-- 		CASE 
-- 			WHEN d.Department_Name IS NOT NULL 
-- 			THEN CONCAT(d.Department_Name, ' (', p.Plant_Name, ')') 
-- 			ELSE NULL 
-- 		END AS Department_Name
-- 		FROM 
-- 			Department d
-- 		INNER JOIN Plant p on p.Plant_Id = d.Plant_Id 
-- 		WHERE 
-- 			d.Status = 1;
--     ELSE
        select
		 *
		 from 
		 Department d
		 where d.Status=1 and d.Company_Id = CompanyId and d.Plant_Id = PlantId;
    -- END IF;

   select*from User_Role_Map where Company_Id =  CompanyId and User_Id = UserId;    
   select*from User_Company_Map where Company_Id =  CompanyId and User_Id = UserId;    
   select*from User_Plant_Map where Company_Id =  CompanyId and User_Id = UserId;    
   select*from User_Gate_Map where Company_Id =  CompanyId and User_Id = UserId;
   
--    IF RoleId = 1 THEN
--        select
-- 		 *
-- 		 from 
-- 		 Plant p
-- 		 where p.Status=1 ;  
--     ELSE
        select
		 *
		 from 
		 Plant p
		 where p.Status=1 and p.Company_Id = CompanyId and p.Check_Token is not null and p.Check_Token != ""; 
    -- END IF;
    
--      IF RoleId = 1 THEN
--          select
--          *
--          from Gate g
--          where g.Status=1;
--     ELSE
        select
         *
         from Gate g
         where g.Status=1 and g.Company_Id = CompanyId; 
    -- END IF;
   
   
   
 if(userId >0)      
  then
   select    
   User_Id ,    
   User_Name , 
   User_Code,
   Password ,    
   Company_Id,    
   Plant_Id ,  
   Gate_Id,
   Default_Role_Id,    
   User_Email,    
   User_Tel_No,    
   Secondary_Mobile_No,
   Address,
   Dept_Id,
   Status,    
   Created_By,    
   Created_On,    
   Modified_By,    
   Modified_On,    
   is_blocked,    
   user_image_name,   
   case when user_image_name is not null then CONCAT(SchemeUser,user_image_name) else null end as UserImageUrl,
   -- case when Digital_Sign is not null then CONCAT(SchemeUserDSign,Digital_Sign) else null end as DigitalSign,
   case when Digital_Sign is not null then CONCAT(SchemeUserDSign,Digital_Sign) else null end as DigitalSign,
   Digital_Sign_Name DigitalSignName
   from Users where User_Id =  userId;       
   select*from Plant p where Status=1 and p.Check_Token is not null and p.Check_Token != "";    
   select*from Gate where Status=1;
   select*from User_Role_Map where User_Id =  userId;    
   select*from User_Company_Map where User_Id =  userId;    
   select*from User_Plant_Map where User_Id =  userId;    
   select*from User_Gate_Map where User_Id =  userId;    
  end if;     
 end if;     
     
 if(Type='OnChangeCompany')    
 then    
 select *    
 from Plant p     
 where p.Company_Id= CompanyId and p.Status=1 and p.Check_Token is not null and p.Check_Token != "";
 end if;
 
 if(Type='OnChangePlant')    
 then
 select *    
 from Gate g 
 where g.Plant_Id= PlantId and g.Company_Id= CompanyId and g.Status=1;
 end if;

 if(Type='SearchInitialize')      
 then
 select    
 u.User_Id UserId,    
 u.User_Name UserName,    
 u.User_Code UserCode,
 u.Password Password,    
 u.Company_Id CompanyId,    
 c.Company_Name CompanyName,    
 u.Plant_Id PlantId,    
 p.Plant_Name PlantName,    
 -- e.First_Name+' '+e.Last_Name EmpName,    
 u.Default_Role_Id DefaultRoleId,    
 r.Role_Name DefaultRoleName,    
 u.User_Email UserEmail,    
 -- e1.Email UserEmailName,    
 u.User_Tel_No UserTelNo,    
 -- e2.Primary_Mobile_No UserTelNoName,    
 u.Secondary_Mobile_No SecondaryMobileNo,
 u.Address SecondaryMobileNo,
 u.Dept_Id SecondaryMobileNo,
 u.Status Status,    
 m.Meta_Sub_Description StatusName,    
 u.Created_By CreatedBy,    
 u1.User_Name CreatedByName,  
 CONVERT(u.Created_On, CHAR(19)) CreatedOn,
 ifnull(CONVERT(u.Modified_On, CHAR(19)),CONVERT(u.Created_On , CHAR(19))) ModifiedOn  ,
 ifnull(u2.User_Name,u1.User_Name) ModifiedByName, 
 u.Modified_By ModifiedBy,    
 u.is_blocked IsBlocked,    
 case when u.is_blocked=0 then 'No' else 'Yes' end as IsBlockedName,    
 u.user_image_name userimagename,    
 u.user_image_url userimageurl    
 from Users u 
 inner join Company c on c.Company_Id=u.Company_Id    
 inner join Plant p on p.Plant_Id=u.Plant_Id    
 -- inner join Employee e with(nolock) on e.Employee_Id = u.Emp_Id    
 inner join role r on r.Role_Id = u.Default_Role_Id    
 -- inner join Employee e1 with(nolock) on e1.Employee_Id = u.Emp_Id    
 -- inner join Employee e2 with(nolock) on e2.Employee_Id = u.Emp_Id    
 inner join Metadata m on m.Meta_Sub_Id = u.Status    
 inner join users u1 on u1.User_Id = u.Created_By    
 left join users u2 on u2.User_Id = u.Modified_By   
  WHERE u.Status = 1 and u.Plant_Id = PlantId
  AND u.Company_Id = CompanyId and p.Check_Token is not null and p.Check_Token != "" and c.Check_Token is not null 
  and c.Check_Token != "" and p.status=1 and c.status=1
AND (
    RoleId = 1 
    OR (RoleId != 1 AND u.Company_Id = CompanyId and u.User_Id != 1) 
)
 order by ifnull(u.Modified_On,u.Created_On) desc;
 end if;    
  
 if(Type='ScreenMapping')
 then
	insert into User_Screen_Mapping
	(
		User_Id,
		Role_Id,
		Company_Id,
		Module_Id,
		Screen_Id,
		`Create`,
		`Update`,
		`Delete`,
		`View`,
		`Print`,
		Approval,
		Status,
		Created_By,
		Created_On,
		Modified_By,
		Modified_On
	)
	-- SELECT  
-- 	US.User_Id,
-- 	RL.Role_Id,
-- 	1,
-- 	SN.Parent_Id AS MODULEID,
-- 	SN.Function_Id AS SCREENID,
-- 	1,
-- 	1,
-- 	1,
-- 	1,
-- 	1,
-- 	1,
-- 	1,
-- 	1,
-- 	now(),
-- 	null,
-- 	null 
-- 	FROM USERS US 
-- 	CROSS JOIN ROLE RL
-- 	CROSS JOIN `FUNCTION` SN
-- 	WHERE SN.Parent_Id != 0 AND US.User_Id =  NewUserId
-- 	AND SN.Is_External = 1 AND RL.Role_Id =  RoleId;
SELECT  
    US.User_Id,
    RL.Role_Id,
    1,
    SN.Parent_Id AS MODULEID,
    SN.Function_Id AS SCREENID,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    NOW(),
    NULL,
    NULL 
FROM USERS US 
CROSS JOIN ROLE RL
CROSS JOIN `FUNCTION` SN
WHERE SN.Parent_Id != 0 
AND US.User_Id = NewUserId
AND SN.Is_External = 1 
AND RL.Role_Id = RoleId
AND (
    RL.Role_Id = 1 OR SN.Function_Id != 14
);
 end if;
END//

DELIMITER ;

