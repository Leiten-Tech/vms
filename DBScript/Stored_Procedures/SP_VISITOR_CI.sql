DROP PROCEDURE IF EXISTS SP_VISITOR_CI;

DELIMITER //
create procedure SP_VISITOR_CI
	(
		IN type VARCHAR(255),
		IN SearchType VARCHAR(255),
		IN VisitorId BIGINT,
		IN CountryId BIGINT,
        IN MobileNosl VARCHAR(255),
		IN StateId BIGINT,
		IN Scheme VARCHAR(255),
		IN Scheme1 VARCHAR(255),
		IN Schemevisitordetail VARCHAR(255)
    )

begin
	if type='CreateInitialize'
	then
		select * from Metadata where Meta_Sub_Id in(35,36);
		select * from Metadata where Meta_Type_Code='TTL';
		select * from Metadata where Meta_Type_Code='IDT' and Meta_Sub_Id <>22;
		select * from Metadata where Meta_Type_Code='STA';
		select * from Metadata where Meta_Type_Code='WSV';
		select * from Country where Status=1;
		select * from Department where Status=1;
		if VisitorId>0
		then
			select * from State where Status=1 and Country_Id=(select Country_Id from Visitor where Visitor_Id=VisitorId);
			select * from City  where Status=1 and State_Id=(select State_Id from Visitor where Visitor_Id=VisitorId);
			select 
			Visitor_Id,
			Visitor_Code,
			Visitor_Type_Id,
			Company_Id,
			Plant_Id,
			Country_Id,
			State_Id,
			City_Id,
			Title_id,
			First_Name,
			Last_Name,
			Dob,
			Visitor_Company,
			Address,
			Mail_Id,
			Mobile_No,
			Id_Card_Type,
			Id_Card_No,
			Document_Name,
			Scheme+Document_Name DocumentUrl,
			Visitor_Document_Name,
			Scheme1+Visitor_Document_Name Visitor_Document_Url,
			Status,
			Created_By,
			Created_On,
			Modified_By,
			Modified_On
			from Visitor where Visitor_Id=VisitorId;
            
			select 
			Visitor_Detail_Id,
			Visitor_Id,
            Visitor_Detail_Code Visitor_Code,
            visitor_detail_Code Visitor_Detail_Code,
			Title_id,
			First_Name,
			Last_Name,
			Department_Id,
			Dob,
			Mail_Id,
			Mobile_No,
			Id_Card_Type,
			Id_Card_No,
			Document_Name,
			Expirry_Date,
		    WorkSeverity,
			Schemevisitordetail+Document_Name DocumentUrl,
			Status
			from Visitor_Detail where Visitor_Id=VisitorId;
		end if;
	end if;
	if type='OnChangeCountry'
	then
		select * from State where Status=1 and Country_Id=CountryId;
	end if;
	if type='OnChangeState'
	then
		select * from City where Status=1 and State_Id=StateId;
	end if;
    
    if type='CheckVisitorExists'
	then
		-- SELECT	
-- 			distinct ved.Mobile_No MobileNo
-- 		FROM
-- 			visitor_entry ve
-- 		INNER JOIN 
-- 			visitor_entry_detail ved ON ved.Visitor_Entry_Id = ve.Visitor_Entry_Id
-- 		LEFT JOIN 
-- 			visitor_entry_log vel ON vel.Visitor_Entry_Code = ve.Visitor_Entry_Code
-- 		WHERE 
--         (MobileNosl IS NULL OR MobileNosl = '' OR FIND_IN_SET(ve.Mobile_No, MobileNosl))
-- 		AND 
-- 			EXISTS (
-- 				SELECT 1 
-- 				FROM visitor_entry_log vel_inner 
-- 				WHERE vel_inner.Visitor_Entry_Code = ve.Visitor_Entry_Code 
-- 				AND vel_inner.Checked_Out IS NULL
-- 			);

SELECT DISTINCT ved.Mobile_No AS MobileNo
FROM visitor_entry ve
INNER JOIN visitor_entry_detail ved ON ved.Visitor_Entry_Id = ve.Visitor_Entry_Id
LEFT JOIN visitor_entry_log vel ON vel.Visitor_Entry_Code = ve.Visitor_Entry_Code
WHERE 
  (MobileNosl IS NULL OR MobileNosl = '' OR ve.Mobile_No = MobileNosl COLLATE utf8mb4_general_ci)
AND EXISTS (
  SELECT 1 
  FROM visitor_entry_log vel_inner
  WHERE vel_inner.Visitor_Entry_Code = ve.Visitor_Entry_Code 
  AND vel_inner.Checked_Out IS NULL
);
		
	end if;
    
	IF (type= 'SearchInitialize') THEN
    DROP TEMPORARY TABLE IF EXISTS TempSelect;
    
    CREATE TEMPORARY TABLE TempSelect (
        MetaSubId INT,
        MetaTypeCode VARCHAR(255),
        MetaSubCode VARCHAR(255),
        MetaTypeName VARCHAR(255),
        MetaSubDescription VARCHAR(255),
        Status INT,
        CreatedBy INT,
        CreatedOn DATETIME,
        ModifiedBy INT,
        ModifiedOn DATETIME
    );
    
    INSERT INTO TempSelect
    SELECT 
        Meta_Sub_Id AS MetaSubId,
        Meta_Type_Code AS MetaTypeCode,
        Meta_Sub_Code AS MetaSubCode,
        Meta_Type_Name AS MetaTypeName,
        Meta_Sub_Description AS MetaSubDescription,
        Status,
        Created_By AS CreatedBy,
        Created_On AS CreatedOn,
        Modified_By AS ModifiedBy,
        Modified_On AS ModifiedOn 
    FROM Metadata WHERE Meta_Sub_Id IN (97, 35, 36)
    ORDER BY MetaSubDescription ASC;
    
    INSERT INTO TempSelect
    SELECT 
        v.Visitor_Id AS VisitorId,
        v.Visitor_Code AS VisitorCode,
        v.Visitor_Type_Id AS VisitorTypeId,
        m.Meta_Sub_Description AS VisitorTypeName,
        v.Company_Id AS CompanyId,
        c.Company_Name AS Company_Name,
        v.Plant_Id AS PlantId,
        p.Plant_Name AS PlantName,
        v.Country_Id AS CountryId,
        c1.Country_Name AS CountryName,
        v.State_Id AS StateId,
        s.State_Name AS StateName,
        v.City_Id AS CityId,
        c2.City_Name AS CityName,
        v.Title_id AS TitleId,
        v.First_Name AS FirstName,
        v.Last_Name AS LastName,
        CONCAT(m1.Meta_Sub_Description, '. ', v.First_Name, ' ', v.Last_Name) AS VisitorName,
        v.Dob AS Dob,
        v.Visitor_Company AS VisitorCompany,
        v.Address AS Address,
        v.Mail_Id AS MailId,
        v.Mobile_No AS MobileNo,
        v.Id_Card_Type AS IdCardType,
        m2.Meta_Sub_Description AS IdCardTypeName,
        v.Id_Card_No AS IdCardNo,
        v.Document_Name AS DocumentName,
        v.Document_Name AS DocumentUrl,
        v.Visitor_Document_Name AS VisitorDocumentName,
        v.Visitor_Document_Url AS VisitorDocumentUrl,
        v.Status AS Status,
        m3.Meta_Sub_Description AS StatusName,
        v.Created_By AS CreatedBy,
        u.User_Name AS CreatedbyName,
        CONVERT(v.Created_On, CHAR) AS CreatedOn,
        IFNULL(CONVERT(v.Modified_On, CHAR), CONVERT(v.Created_On, CHAR)) AS ModifiedOn,
        IFNULL(u.User_Name, u1.User_Name) AS ModifiedByName,
        v.Modified_By AS ModifiedBy
    FROM Visitor v
    INNER JOIN Metadata m ON m.Meta_Sub_Id = v.Visitor_Type_Id
    INNER JOIN Metadata m1 ON m1.Meta_Sub_Id = v.Title_id
    INNER JOIN Metadata m2 ON m2.Meta_Sub_Id = v.Id_Card_Type
    INNER JOIN Metadata m3 ON m3.Meta_Sub_Id = v.Status
    INNER JOIN Company c ON c.Company_Id = v.Company_Id
    INNER JOIN Plant p ON p.Plant_Id = v.Plant_Id
    INNER JOIN Country c1 ON c1.Country_Id = v.Country_Id
    INNER JOIN State s ON s.State_Id = v.State_Id
    INNER JOIN City c2 ON c2.City_Id = v.City_Id
    INNER JOIN Users u ON u.User_Id = v.Created_By
    LEFT JOIN Users u1 ON u1.User_Id = v.Modified_By
    WHERE p.Check_Token is not null and p.Check_Token != "" and c.Check_Token is not null and c.Check_Token != "" and p.status=1 and c.status=1;
    
    IF (SearchType_param = 35 OR SearchType_param = 36) THEN
        SELECT * FROM TempSelect v
        WHERE VisitorTypeId = SearchType_param
        ORDER BY IFNULL(v.ModifiedOn, v.CreatedOn) DESC;
    ELSE
        SELECT * FROM TempSelect v
        ORDER BY IFNULL(v.ModifiedOn, v.CreatedOn) DESC;
    END IF;
    end if;
END //

DELIMITER ;

