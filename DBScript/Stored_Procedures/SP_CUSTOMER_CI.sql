DELIMITER //
DROP PROCEDURE IF EXISTS SP_CUSTOMER_CI;
CREATE PROCEDURE SP_CUSTOMER_CI   
(
	IN Type LONGTEXT,  
	IN Customerid int,
	IN CountryId int,
	IN StateId int,
	IN Scheme LONGTEXT,
	IN CompanyId bigint
)
BEGIN  
if(Type='CreateInitialize')  
	THEN
	select*from Metadata where Meta_Type_Code = 'STA';
	select * from Country where Status=1;
	if(Customerid >0)  
		then
		select*from State where Status=1;
		select*from City where Status=1;
		select 
		Customer_Id,
		Customer_Code,
		Customer_Name,
		Country_Id,
		State_Id,
		City_Id,
		Company_Id,
		Plant_Id,
		Customer_Image_Name,
		 Scheme+Customer_Image_Name CustomerImageUrl,
		Status,
		Created_By,
		Created_On,
		Modified_By,
		Modified_On,
		Contact_Person,
		Phone_Number
		Phone_Number,
		Email,
		Address
		from Customer where  Customer_Id= Customerid;  
		end if; 
	end if; 
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
	c.Customer_Id CustomerId,
	c.Customer_Code CustomerCode,
	c.Customer_Name CustomerName,
	cy.Country_Name CountryName, 
	c.Country_Id CountryId,
	s.State_Name StateName,
	c.State_Id StateId,
	ci.City_Name CityName,
	c.City_Id CityId,
	cm.Company_Name CompanyName,
	c.Company_Id CompanyId,
	p.Plant_Name PlantName,
	p.Plant_Id PlantId,
	c.Customer_Image_Name CustomerImageName,
	c.Customer_Image_Url CustomerImageUrl,
	m.Meta_Sub_Description StatusName,
	c.Status Status,
	u.User_Name CreatedByName,
	CONVERT(c.Created_On, char(19)) CreatedOn,
	ifnull(CONVERT(c.Modified_On,char(19)),CONVERT(c.Created_On , char(19))) ModifiedOn  ,
	ifnull(u.User_Name,um.User_Name) ModifiedByName,
	c.Modified_By ModifiedBy
	from Customer c 
	inner join Country cy on cy.Country_Id = c.Country_Id
	inner join State s on s.State_Id = c.State_Id
	inner join City ci on ci.City_Id= c.City_Id
	inner join Company cm on cm.Company_Id = c.Company_Id
	inner join Plant p on p.Plant_Id = c.Plant_Id
	inner join Metadata m on m.Meta_Sub_Id = c.Status
	inner join users u on u.User_Id = c.Created_By
	left join users um on um.User_Id = c.Modified_By
	where c.Company_Id= CompanyId and p.Check_Token is not null and p.Check_Token != "" and cm.Check_Token is not null and cm.Check_Token != "" and p.status=1 and cm.status=1
	order by ifnull(c.Modified_On,c.Created_On ) desc;   
	end if; 
END //
Delimiter ;