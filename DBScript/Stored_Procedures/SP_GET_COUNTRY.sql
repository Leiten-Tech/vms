DELIMITER //
DROP PROCEDURE IF EXISTS SP_GET_COUNTRY;
create procedure SP_GET_COUNTRY
(
	IN Countryid bigint,
	IN Taskname LONGTEXT
)
BEGIN
if (TaskName='SEARCHINITIALIZE')
THEN	
	SELECT
		c.Country_Id CountryId,
		c.Country_Name CountryName,
		c.Country_Code CountryCode,
		c.Country_Short_Form CountryShortForm,
		c.Nationality Nationality,
		c.Status Status,
		m.Meta_Sub_Description StatusName,
		c.Created_By CreatedBy,
		u.User_Name CreatedByName,
		 CONVERT(c.Created_On, CHAR(19)) CreatedOn,
		 ifnull(CONVERT(c.Modified_On,CHAR(19)),CONVERT(c.Created_On , CHAR(19))) ModifiedOn  ,
		 ifnull(u.User_Name,u1.User_Name) ModifiedByName,
		 c.Modified_By ModifiedBy
		FROM Country c
		inner join Metadata m on m.Meta_Sub_Id = c.Status
		inner join Users u on u.User_Id= c.Created_By
		left join Users u1 on u1.User_Id= c.Modified_By
		order by ifnull( c.Modified_On,c.Created_On) desc;  
END IF;
IF (TaskName='CREATEINITIALIZE')
THEN	
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

	IF(Countryid>0)
	THEN
		SELECT
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
		FROM Country c
		WHERE Country_Id=@Countryid;
	END IF;
END IF;
END //
DELIMITER ;