DELIMITER //
DROP PROCEDURE IF EXISTS SP_ROUTE_CI;
CREATE PROCEDURE SP_ROUTE_CI   
(    
	IN Type longtext,    
	IN RouteId bigint  ,
    IN PlantId BIGINT,
    IN CompanyId BIGINT,
    IN RoleId BIGINT
)
BEGIN      
if( Type='CreateInitialize')      
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
from Metadata where Meta_Type_Code = 'STA';
select*from Route ;  
if( RouteId >0)    
 then
 select * from Route where  Route_Id= RouteId   ;
 end if;   
 end if;   
 if( Type='SearchInitialize')    
 then  
 select
 r.Route_Id RouteId,
 r.Route_Code RouteCode,
 r.Route_Name RouteName,  
 r.Route_Desc RouteDesc,  
 r.Route_Distance_In_Km RouteDistanceInKm,
 r.From_Location FromLocation,
 r.To_Location ToLocation,
 c.Company_Id CompanyId,
 p.Plant_Id PlantId,
 r.Status Status,
 m.Meta_Sub_Description StatusName, 
 r.Created_By CreatedBy,
 u.User_Name CreatedByName,
CONVERT( r.Created_On, CHAR(19)) CreatedOn,
ifnull(CONVERT(r.Modified_On  , CHAR(19)),CONVERT(r.Created_On , CHAR(19))) ModifiedOn  ,
ifnull(u.User_Name,u1.User_Name) ModifiedByName, 
r.Modified_By ModifiedBy
 from Route r   
 inner join Company c on c.Company_Id = r.Company_Id  
 inner join Plant p on p.Plant_Id = r.Plant_Id  
 inner join MetaData m on m.Meta_Sub_Id = r.Status
 inner join Users u on u.User_Id=r.Created_By
 left join Users u1 on u1.User_Id=r.Modified_By
 where r.Company_Id = CompanyId and r.Plant_Id = PlantId and p.Check_Token is not null and p.Check_Token != "" and c.Check_Token is not null and c.Check_Token != "" 
 order by ifnull(r.Modified_On,r.Created_On) desc;
 end if;   
END //
DELIMITER ;

