DELIMITER //
 DROP PROCEDURE IF EXISTS SP_GATE_CI;
CREATE PROCEDURE SP_GATE_CI   
(   
	IN Type longtext,      
	IN GateId int,      
	IN CompanyId int,
	IN PlantId bigint ,
    IN RoleId BIGINT
)
BEGIN      
if(Type='CreateInitialize')      
then
 select*from Metadata where Meta_Type_Code = 'STA';
 select * from Users u 
 inner join Role r on r.Role_Id=u.Default_Role_Id  
 where r.Role_Name='Supervisor' and u.Status=1 and u.Plant_Id =  PlantId;
 select*from Company c where Status=1 and c.Company_Id = CompanyId; 
 select *
 from Users u 
 inner join Role r on r.Role_Id=u.Default_Role_Id
 where r.Role_Name='Security' and u.Status=1 and u.Plant_Id =  PlantId;
 if(GateId >0)      
 then
  select*from Plant p where p.Status=1 and p.Plant_Id =  PlantId;  
  select * from Gate where  Gate_Id = GateId;  
  select*from Gate_Detail where Gate_Id = GateId;  
 end if;      
end if;     
  if(Type='OnChangeCompany')    
   then
   select *    
   from Plant p 
   where p.Company_Id = CompanyId and p.Check_Token is not null and p.Check_Token != "" and p.status=1; 
  end if;   
 if(Type='SearchInitialize')      
 then
 select    
 g.Gate_Id GateId,  
 g.Gate_Name GateName,  
 g.Gate_Code GateCode,  
 g.Gate_No GateNo,  
 u.User_Name FirstName,
 g.Gate_Incharge_id GateInchargeid,  
 g.Gate_Open_Time GateOpenTime,  
 g.Gate_Close_Time GateCloseTime,  
 c.Company_Name CompanyName,  
 g.Company_Id CompanyId,  
 g.Plant_Id PlantId,  
 p.Plant_Name PlantName,  
 m.Meta_Sub_Description StatusName,  
 g.Status Status,  
 g.Created_By CreatedBy,  
 u.User_Name CreatedByName,  
 CONVERT(g.Created_On, char(19)) CreatedOn,    
 IFNULL(CONVERT(g.Modified_On, char(19)),CONVERT(g.Created_On, CHAR(19))) ModifiedOn,    
 g.Modified_By ModifiedBy,  
 IFNULL(u1.User_Name,u.User_Name) ModifiedByName  
 from Gate g  
 inner join Company c on c.Company_Id = g.Company_Id  
 inner join Plant p on p.Plant_Id = g.Plant_Id  
 inner join Metadata m on m.Meta_Sub_Id = g.Status  
 left join Users us on us.User_Id = g.Gate_Incharge_id  
 inner join users u on u.User_Id = g.Created_By  
 left join Users u1 on u1.User_Id = g.Modified_By 
 where g.Company_Id= CompanyId and g.Plant_Id = PlantId and p.Check_Token is not null and p.status=1 and c.status=1
  order by ifnull(g.Modified_On,g.Created_On) desc;
 end if;      
END  //
DELIMITER ;
  
  
  
  