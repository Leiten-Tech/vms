DELIMITER //
DROP PROCEDURE IF EXISTS SP_AREA_CI;
CREATE  PROCEDURE SP_AREA_CI     
( 
	IN Type longtext,    
	IN AreaId bigint,    
	IN CompanyId bigint ,
    IN PlantId bigint,
    IN RoleId bigint
)
BEGIN    
if(Type='CreateInitialize')    
 then
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
 select*from Company c WHERE c.Company_Id = CompanyId and c.Status = 1;
 select*from Plant p WHERE p.Company_Id = CompanyId and p.Status = 1;
 if(AreaId >0)    
  then
  select * from Area  where  Area_Id=AreaId  ;     
  end if;   
 end  if;
 if(Type='OnChangeCompany')
	then
		select*from Plant where Status=1 and Company_Id=CompanyId;
	end if;
 if(Type='SearchInitialize')    
 then
 select 
 a.Area_Id AreaId,
 a.Area_Code AreaCode,  
 a.Area_Name AreaName,  
 c.Company_Id CompanyId,
 c.Company_Name CompanyName,
 p.Plant_Id PlantId,
 p.Plant_Name PlantName,
 a.Status Status,
 m.Meta_Sub_Description StatusName,  
 a.Created_By CreatedBy,
 u.User_Name CreatedByName,
 CONVERT( a.Created_On, CHAR(19)) CreatedOn,
ifnull(a.Modified_On  , CHAR(19)),CONVERT(a.Created_On , CHAR(19)) ModifiedOn  ,
ifnull(u.User_Name,u1.User_Name) ModifiedByName, 
a.Modified_By ModifiedBy
 from Area a   
 left join Company c on c.Company_Id = a.Company_Id  
 left join Plant p on p.Plant_Id = a.Plant_Id  
 left join MetaData m on m.Meta_Sub_Id = a.Status
 left join Users u on u.User_Id=a.Created_By
 left join Users u1 on u1.User_Id=a.Modified_By
 where a.Company_Id=CompanyId and a.Plant_Id = PlantId
 order by ifnull(a.Modified_On,a.Created_On) desc;
 end if;   
END  //
DELIMITER ;
