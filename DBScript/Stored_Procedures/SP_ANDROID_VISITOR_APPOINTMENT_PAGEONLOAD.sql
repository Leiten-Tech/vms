DROP PROCEDURE IF EXISTS SP_ANDROID_VISITOR_APPOINTMENT_PAGEONLOAD;
DELIMITER //
CREATE PROCEDURE SP_ANDROID_VISITOR_APPOINTMENT_PAGEONLOAD
(
	IN _CompanyId INT,
	IN _PlantId INT,
	IN _RoleId BIGINT
)
BEGIN
-- PLANT INFORMARION
SELECT 
Plant_Id,
Plant_Code,
Plant_Name 

FROM Plant  WHERE Company_Id = _CompanyId AND Status = 1;

-- DEPARTMENT INFORMARION
SELECT 
Department_Id,
Department_Code,
Department_Name

FROM Department WHERE Status = 1 and Company_Id = _CompanyId;

-- AREA TO VISIT INFORMARION
SELECT 
Area_Id,
Area_Code,
Area_Name

FROM AREA WHERE Status = 1 and Company_Id = _CompanyId  and Plant_Id = _PlantId;

-- PERSON TO VISIT INFORMARION
SELECT 
User_Id,
User_Code,
User_Name

FROM users WHERE Company_Id = _CompanyId and Plant_Id=_PlantId and Status = 1;

-- PURPOSE OF VISIT
SELECT 
Meta_Sub_Id,
Meta_Sub_Description

FROM metadata WHERE Meta_Type_Code = 'POV';

END //
DELIMITER ;
