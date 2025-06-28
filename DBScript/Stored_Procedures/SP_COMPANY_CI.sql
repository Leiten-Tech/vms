DELIMITER //
 DROP PROCEDURE IF EXISTS SP_COMPANY_CI;
CREATE PROCEDURE SP_COMPANY_CI       
( 
	IN Type LONGTEXT,      
	IN CompanyId bigint,
	IN CountryId bigint , 
	IN StateId bigint
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
 select*from Country where Status =1;
 if(CompanyId >0)      
  then
  select*from State where Status=1;
  select*from City  where Status=1;
  select * from Company where  Company_Id= CompanyId;     
  end if;      
 end if;
 -- new
 if(Type='OnChangeCountry')
	then
		select*from State where Status=1 and Country_Id= CountryId;
	end if;
	if(Type='OnChangeState')
	then
		select*from City where Status=1 and State_Id= StateId;
	end if;
 if(Type='SearchInitialize')      
 then      
 select    
 c.Company_Id CompanyId, 
 c.Company_Code CompanyCode,    
 c.Company_Name CompanyName,
 c.Country_Id CountryId, 
 cv.Country_Name CountryName,
 c.State_Id StateId,
 s.State_Name StateName, 
 c.city_Id CityId,
 cy.City_Name CityName, 
 c.Status Status,
 m.Meta_Sub_Description StatusName,
 c.Created_By CreatedBy,
 u.User_Name CreatedByName,
CONVERT(c.Created_On, char(19)) CreatedOn,
ifnull(CONVERT(c.Modified_On  , char(19)),CONVERT(c.Created_On , char(19))) ModifiedOn  ,
ifnull(u.User_Name,u1.User_Name) ModifiedByName, 
c.Modified_By ModifiedBy
 from Company c     
 inner join MetaData m on m.Meta_Sub_Id = c.Status
 inner join Users u on u.User_Id=c.Created_By
 inner join Country cv on cv.Country_Id = c.Country_Id
inner join State s on s.State_Id = c.State_Id
inner join City cy on cy.City_Id = c.city_Id
left join Users u1 on u1.User_Id=c.Modified_By
where c.Check_Token is not null and c.Check_Token != "" and c.status=1
order by ifnull(c.Modified_On,c.Created_On) desc;
 end if;     
END //
 DELIMITER ;