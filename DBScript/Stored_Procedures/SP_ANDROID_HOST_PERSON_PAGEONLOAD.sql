DROP PROCEDURE IF EXISTS SP_ANDROID_HOST_PERSON_PAGEONLOAD;
DELIMITER //
CREATE PROCEDURE SP_ANDROID_HOST_PERSON_PAGEONLOAD
(
	IN _CompanyId INT,
	IN _PlantId INT,
	IN _RoleId BIGINT,
    IN _DepartmentId BIGINT
)
BEGIN

-- AREA TO VISIT INFORMARION
SELECT 
Area_Id,
Area_Code,
Area_Name

FROM AREA WHERE Status = 1 and Company_Id = _CompanyId  and Plant_Id = _PlantId ;

-- PERSON TO VISIT INFORMARION
SELECT 
User_Id,
User_Code,
User_Name

FROM users WHERE Company_Id = _CompanyId and Plant_Id=_PlantId  and Dept_Id=_DepartmentId and Status = 1 and Default_Role_Id<>5;

-- PURPOSE OF VISIT
SELECT 
Meta_Sub_Id,
Meta_Sub_Description

FROM metadata WHERE Meta_Type_Code = 'POV';

END //
DELIMITER ;
