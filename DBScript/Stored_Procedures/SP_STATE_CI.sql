DELIMITER //
DROP PROCEDURE IF EXISTS SP_STATE_CI;

CREATE PROCEDURE SP_STATE_CI 
(
	IN Type varchar(100),
	IN Stateid int
)
BEGIN
if(Type='CreateInitialize')
THEN
	  select 
	    c.Country_Id CountryId,
		c.Country_Name CountryName,
		c.Country_Code CountryCode,
		c.Country_Short_Form CountryShortForm,
		c.Nationality Nationality,
		c.Status Status,
		c.Created_By CreatedBy,
		c.Created_On CreatedOn,
		c.Modified_By ModifiedBy,
		c.Modified_On ModifiedOn
	  from Country c 
	  where status=1
	  ORDER BY c.Country_Name;

	  select 
	    m.Meta_Sub_Id MetaSubId,
		m.Meta_Type_Code MetaTypeCode,
		m.Meta_Sub_Code MetaSubCode,
		m.Meta_Type_Name MetaTypeName,
		m.Meta_Sub_Description MetaSubDescription,
		m.Status Status,
		m.Created_By CreatedBy,
		m.Created_On CreatedOn,
		m.Modified_By ModifiedBy,
		m.Modified_On ModifiedOn
	  from Metadata m
	  where  Meta_Type_Code ='STA';
	
	if(Stateid >0)
	then
	select 
	s.State_Id StateId,
	s.State_Code StateCode,
	s.State_Name StateName,
	s.Country_Id CountryId,
	s.Created_By CreatedBy,
	s.Created_On CreatedOn,
	s.Modified_By ModifiedBy,
	s.Modified_On ModifiedOn
	from 
	State s
	where  State_Id=@Stateid;
	end if;
end if;
if(Type='SearchInitialize')
then
select 
c.Country_Name CountryName,
s.State_Code StateCode,
s.State_Name StateName,
s.Status Status,
m.Meta_Sub_Description StatusName,
s.Country_Id CountryId,
s.State_Id StateId,
c.Created_By CreatedBy,
u.User_Name CreatedByName,
CONVERT(s.Created_On,char(19)) CreatedOn,
ifnull(CONVERT(s.Modified_On, char(19)),CONVERT(s.Created_On , char(19))) ModifiedOn  ,
ifnull(u.User_Name,u1.User_Name) ModifiedByName,
s.Modified_By ModifiedBy
 from State s
inner join Country c on c.Country_Id = s.Country_Id
inner join Metadata m on m.Meta_Sub_Id = s.Status
inner join Users u on u.User_Id = s.Created_By
left join Users u1 on u1.User_Id=c.Modified_By
order by ifnull(s.Modified_On,s.Created_On) desc;
-- order by s.Created_On desc
end if;
END //
DELIMITER ;