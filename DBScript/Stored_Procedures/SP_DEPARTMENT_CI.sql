DELIMITER //
DROP PROCEDURE IF EXISTS SP_DEPARTMENT_CI;
CREATE PROCEDURE SP_DEPARTMENT_CI   
(
	IN Type LONGTEXT,  
	IN DeptId int ,
    IN CompanyId bigint,
    IN RoleId bigint,
    IN PlantId bigint
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
 
 select
 u.User_Id UserId,
 u.User_Name UserName
 from
 users u
 where u.Status = 1 and u.Company_Id = CompanyId and u.Plant_Id = PlantId AND (DeptId = 0 OR u.Dept_Id = DeptId);
 
  if(DeptId >0)  
  then
  select * from Department where  Department_Id=DeptId ;
  end if; 
  end if;
  if(Type='SearchInitialize')  
	then
	select
	d.Department_Id DepartmentId,
	d.Department_Name DepartmentName,
	d.Department_Code DepartmentCode,
	c.Company_Id CompanyId,
	c.Company_Name CompanyName,
	p.Plant_Id PlantId,
	p.Plant_Name PlantName,
	d.Status Status,
	m.Meta_Sub_Description StatusName,  
	d.Created_By CreatedBy,
	 u.User_Name CreatedByName,
	 CONVERT(d.Created_On, char(19)) CreatedOn,
	 ifnull(CONVERT(d.Modified_On, char(19)),CONVERT(d.Created_On , char(19))) ModifiedOn  ,
	 ifnull(u.User_Name,u1.User_Name) ModifiedByName, 
	 d.Modified_By ModifiedBy
	from Department d 
	inner join Company c on c.Company_Id = d.Company_Id
	inner join Plant p on p.Plant_Id = d.Plant_Id
	inner join MetaData m on m.Meta_Sub_Id = d.Status
	left join Users u on u.User_Id=d.Created_By
 left join Users u1 on u1.User_Id=d.Modified_By
 where d.Plant_Id = PlantId and d.Company_Id = CompanyId
 order by ifnull(d.Modified_On,d.Created_On)   desc;
	end if; 
END //
DELIMITER ;
