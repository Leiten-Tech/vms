DELIMITER //
DROP PROCEDURE IF EXISTS SP_CITY_CI;
CREATE PROCEDURE SP_CITY_CI   
(
	IN Type LONGTEXT,  
	IN CityId bigint,
	IN CountryId bigint
)
BEGIN  
	if(Type='CreateInitialize')  
	then
	select*from Metadata where Meta_Type_Code = 'STA';
	select*from Country where Status=1 ORDER BY Country_Name;
	if(Cityid >0)  
		then  
		select * from State s 
		inner join City c on c.State_Id=s.State_Id and c.City_Id= CityId  
		where s.Status=1 ORDER BY State_Name;
		select * from City where  City_Id= CityId;
		end if;
	end  if;
	if(Type='OnChangeCountry')
	then
		select*from State where Status=1 and Country_Id=CountryId  ORDER BY State_Name;
	end if;
	if(Type='SearchInitialize')  
	then  
	select
	c.City_Id CityId,
	c.Country_Id CountryId,
	cn.Country_Name CountryName ,
	c.State_Id StateId,
	s.State_Name StateName ,
	c.City_Name CityName,
	c.City_Code CityCode,
	cy.Company_Id CompanyId,
	cy.Company_Name CompanyName,
	c.Plant_Id PlantId,
	p.Plant_Name PlantName,
	c.Status Status,
	m.Meta_Sub_Description StatusName,
	c.Created_By CreatedBy,
	u1.User_Name CreatedByName,  
	c.Modified_By ModifiedBy ,
	ifnull(u2.User_Name,u1.User_Name) ModifiedByName, 
	CONVERT(c.Created_On , char(19)) CreatedOn,
	ifnull(CONVERT(c.Modified_On  , CHAR(19)),CONVERT(c.Created_On , CHAR(19))) ModifiedOn  
	from City c 
	inner join Country cn on cn.Country_Id = c.Country_Id
	inner join State s on s.State_Id = c.State_Id
	inner join Company cy on cy.Company_Id = c.Company_Id
	inner join Plant p on p.Plant_Id = c.Plant_Id
	inner join Metadata m on m.Meta_Sub_Id = c.Status   
	left join users u1 on u1.User_Id = c.Created_By      
	left join users u2 on u2.User_Id = c.Modified_By
    where p.Check_Token is not null and p.Check_Token != "" and cy.Check_Token is not null and cy.Check_Token != "" and p.status=1 and cy.status=1
	order by ifnull(c.Modified_On,c.Created_On)   desc;
	end if;
END //
DELIMITER ;
