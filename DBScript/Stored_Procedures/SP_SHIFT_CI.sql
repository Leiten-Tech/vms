DELIMITER //
DROP PROCEDURE IF EXISTS SP_SHIFT_CI;
CREATE PROCEDURE SP_SHIFT_CI     
(
	IN Type longtext,    
	IN ShiftId int ,
    IN CompanyId int,
	IN PlantId bigint ,
    IN RoleId BIGINT
)
BEGIN
if(Type='CreateInitialize')
THEN	
select 
Meta_Sub_Id MetaSubId,
Meta_Type_Code MetaTypeCode,
Meta_Sub_Code MetaSubCode,
Meta_Type_Name MetaTypeName,
Meta_Sub_Description MetaSubDescription,
Status Status,
Meta_Sub_Description StatusName,
Created_By CreatedBy,
Modified_By ModifiedBy,
Modified_On ModifiedOn    
 from Metadata where Meta_Type_Code = 'STA' ;
 select*from Shift where Status=1;
 if(ShiftId >0)    
  then
  select * from Shift where  Shift_Id=ShiftId ;  
  end if;   
 end if;   
 if(Type='SearchInitialize')    
 then  
 select
 s.Shift_Id ShiftId,
 s.Shift_Code ShiftCode,
 s.Shift_Name ShiftName,  
TIME_FORMAT(s.Shift_From_Time, '%h:%i %p') AS ShiftFromTime,
TIME_FORMAT(s.Shift_To_Time, '%h:%i %p') AS ShiftToTime,
 -- CONVERT(VARCHAR(5), REPLACE(CONVERT(VARCHAR(5), DATEADD(MINUTE, DATEDIFF(MINUTE, s.Shift_From_Time, s.Shift_To_Time), 108), 108), ':', '.')) AS ShiftHours,
   CONCAT(
        LPAD(FLOOR(TIMESTAMPDIFF(MINUTE, s.Shift_From_Time, s.Shift_To_Time) / 60), 2, '0'), '.', 
        LPAD(TIMESTAMPDIFF(MINUTE, s.Shift_From_Time, s.Shift_To_Time) % 60, 2, '0')
    ) AS ShiftHours,
 c.Company_Id CompanyId,
 p.Plant_Id PlantId,
 p.Plant_Name PlantName,
s.Status Status,
m.Meta_Sub_Description StatusName,  
 s.Created_By CreatedBy,
u.User_Name CreatedByName,
 CONVERT(s.Created_On, CHAR(19)) CreatedOn,
ifnull(CONVERT(s.Modified_On ,CHAR(19)),CONVERT(s.Created_On , CHAR(19))) ModifiedOn  ,
ifnull(u.User_Name,u1.User_Name) ModifiedByName, 
s.Modified_By ModifiedBy
from Shift s   
 inner join Company c on c.Company_Id = s.Company_Id  
 inner join Plant p on p.Plant_Id = s.Plant_Id  
 inner join MetaData m on m.Meta_Sub_Id = s.Status
 inner join Users u on u.User_Id=s.Created_By
 left join Users u1 on u1.User_Id=s.Modified_By
 where s.Company_Id = CompanyId and  s.Plant_Id = PlantId and p.Check_Token is not null and p.Check_Token != "" and c.Check_Token is not null and c.Check_Token != "" and p.status=1 and c.status=1
  order by ifnull(s.Modified_On,s.Created_On) desc ;
 end if;   
END  //
DELIMITER ;

