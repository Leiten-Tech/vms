DROP PROCEDURE IF EXISTS SP_APPROVALCONFIGURATION_CI;
DELIMITER //
CREATE procedure `SP_APPROVALCONFIGURATION_CI`(
    IN Type VARCHAR(255),
    IN ApprovalConfigurationId BIGINT,
    IN RoleId BIGINT,
    IN DeptId VARCHAR(255),
    IN PrimaryUserId BIGINT,
    IN CompanyId BIGINT,
    IN PlantId BIGINT
)
BEGIN
    IF (Type = 'CreateInitialize') THEN
        SELECT * FROM Metadata WHERE Meta_Type_Code = 'STA';
        SELECT * FROM Plant WHERE Status = 1 AND Company_Id = CompanyId;
        SELECT * FROM `function` WHERE Status = 1 AND Parent_Id != 0;
        SELECT * FROM Metadata WHERE Meta_Type_Code = 'ATY';
        SELECT * FROM Metadata WHERE Meta_Type_Code = 'LVL';
        SELECT * FROM Role r WHERE r.Status = 1 and r.Company_Id = CompanyId and r.Plant_Id = PlantId;
        SELECT * FROM Department d WHERE d.Status = 1 and d.Company_Id = CompanyId and d.Plant_Id = PlantId;
        
        IF (ApprovalConfigurationId > 0) THEN
            SELECT * FROM Users u where u.Company_Id = CompanyId and u.Plant_Id = PlantId;
            SELECT * FROM Approval_Configuration WHERE Approval_Configuration_Id = ApprovalConfigurationId;
            SELECT * FROM Approval_Configuration_Details WHERE Approval_Configuration_Id = ApprovalConfigurationId;
        END IF;
    END IF;
    
    IF (Type = 'OnChangeRole') THEN
        SELECT * FROM Users u WHERE u.Default_Role_Id = RoleId AND u.Status = 1 AND u.Plant_Id = PlantId;
    END IF;
    
    IF (Type = 'OnChangeDepartment') THEN
        SELECT * FROM Users u WHERE
         (DeptId IS NULL OR DeptId = '' OR FIND_IN_SET(u.Dept_Id, DeptId))
        AND u.Status = 1 AND u.Plant_Id = PlantId;
    END IF;
    
    IF (Type = 'SearchInitialize') THEN
        SELECT
            a.Approval_Configuration_Id AS ApprovalConfigurationId,
            a.Company_Id AS CompanyId,
            c.Company_Name AS CompanyName,
            a.Plant_Id AS PlantId,
            p.Plant_Name AS PlantName,
            a.Document_Id AS DocumentId,
            f.Function_Name AS DocumentName,
            a.Approval_Activity_Id AS ApprovalActivityId,
            m.Meta_Sub_Description AS ApprovalActivityName,
            a.Status AS Status,
            m1.Meta_Sub_Description AS StatusName,
            a.Created_By AS CreatedBy,
            u.User_Name AS CreatedByName,
            a.Modified_By AS ModifiedBy,
            COALESCE(u1.User_Name, u.User_Name) AS ModifiedByName,
            CONVERT(a.Created_On, CHAR) AS CreatedOn,
            COALESCE(CONVERT(a.Modified_On, CHAR), CONVERT(a.Created_On, CHAR)) AS ModifiedOn
        FROM
            Approval_Configuration a
        INNER JOIN
            Company c ON c.Company_Id = a.Company_Id
        INNER JOIN
            Plant p ON p.Plant_Id = a.Plant_Id
        INNER JOIN
            `function` f ON f.Function_Id = a.Document_Id
        INNER JOIN
            Metadata m ON m.Meta_Sub_Id = a.Approval_Activity_Id
        INNER JOIN
            Metadata m1 ON m1.Meta_Sub_Id = a.Status
        INNER JOIN
            Users u ON u.User_Id = a.Created_By
        LEFT JOIN
            Users u1 ON u1.User_Id = a.Modified_By
		where 
		a.Plant_Id = PlantId and a.Company_Id = CompanyId and p.Check_Token is not null and p.Check_Token != "" and c.Check_Token is not null and c.Check_Token != "" and p.status=1 and c.status=1
        ORDER BY
            COALESCE(a.Modified_On, a.Created_On) DESC;
    END IF;
END