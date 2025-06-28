DELIMITER //
DROP PROCEDURE IF EXISTS SP_PLANT_CI;
CREATE PROCEDURE SP_PLANT_CI (
    IN Type VARCHAR(255),
    IN PlantId INT,
    IN CountryId INT,
    IN StateId INT,
    IN CompanyId BIGINT,
    IN RoleId BIGINT
)
BEGIN
    IF Type = 'CreateInitialize' THEN
        SELECT 
            Meta_Sub_Id AS MetaSubId,
            Meta_Type_Code AS MetaTypeCode,
            Meta_Sub_Code AS MetaSubCode,
            Meta_Type_Name AS MetaTypeName,
            Meta_Sub_Description AS MetaSubDescription,
            Status AS Status,
            Meta_Sub_Description AS StatusName,
            Created_By AS CreatedBy,
            Modified_By AS ModifiedBy,
            Modified_On AS ModifiedOn
        FROM Metadata
        WHERE Meta_Type_Code = 'STA';

        SELECT * FROM Metadata WHERE Meta_Type_Code = 'PLT';

        SELECT * FROM Company c WHERE c.Company_Id = CompanyId and c.Status = 1;

        SELECT * FROM Country WHERE Status = 1;

        IF PlantId > 0 THEN
            SELECT * FROM State WHERE Status = 1;

            SELECT * FROM City WHERE Status = 1;

            SELECT * FROM Plant WHERE Plant_Id = PlantId;
        END IF;
    END IF;

    IF Type = 'OnChangeCountry' THEN
        SELECT * FROM State WHERE Status = 1 AND Country_Id = CountryId;
    END IF;

    IF Type = 'OnChangeState' THEN
        SELECT * FROM City WHERE Status = 1 AND State_Id = StateId;
    END IF;

    IF Type = 'SearchInitialize' THEN
        SELECT
            p.Plant_Id AS PlantId,
            p.Plant_Code AS PlantCode,
            p.Plant_Name AS PlantName,
            Plant_Type as PlantType,
            m.Meta_Sub_Description AS PlantTypeName,
            p.Address AS Address,
            p.Geo_Location AS GeoLocation,
            p.Country_Id AS CountryId,
            c.Country_Name AS CountryName,
            p.city_Id AS CityId,
            cy.City_Name AS CityName,
            p.State_Id AS StateId,
            s.State_Name AS StateName,
            cm.Company_Name AS CompanyName,
            p.Company_Id AS CompanyId,
            m1.Meta_Sub_Description AS StatusName,
            p.Status AS Status,
            u.User_Name AS CreatedByName,
            p.Created_By AS CreatedBy,
            p.Created_On as CreatedOn,
            p.Modified_By as ModifiedBy,
            p.Modified_On as ModifiedOn,
            p.Url_Token AS UrlToken,
            p.Check_Token AS CheckToken,
            p.Is_Automatic_Approve IsAutoApprove,
            CONVERT(p.Created_On, CHAR(19)) AS CreatedOn,
            IFNULL(CONVERT(p.Modified_On, CHAR(19)), CONVERT(p.Created_On, CHAR(19))) AS ModifiedOn,
            IFNULL(u.User_Name, u1.User_Name) AS ModifiedByName,
            p.Modified_By AS ModifiedBy
        FROM Plant p
        INNER JOIN Metadata m ON m.Meta_Sub_Id = p.Plant_Type
        INNER JOIN Country c ON c.Country_Id = p.Country_Id
        INNER JOIN City cy ON cy.City_Id = p.city_Id
        INNER JOIN State s ON s.State_Id = p.State_Id
        INNER JOIN Company cm ON cm.Company_Id = p.Company_Id
        INNER JOIN Metadata m1 ON m1.Meta_Sub_Id = p.Status
        INNER JOIN Users u ON u.User_Id = p.Created_By
        LEFT JOIN Users u1 ON u1.User_Id = p.Modified_By
        WHERE p.Company_Id = CompanyId and  p.status=1 and cm.status=1 -- and p.Check_Token is not null and p.Check_Token != "" and cm.Check_Token is not null and cm.Check_Token != "" and p.status=1 and cm.status=1
        ORDER BY IFNULL(p.Modified_On, p.Created_On) DESC;
    END IF;
END //

DELIMITER ;

