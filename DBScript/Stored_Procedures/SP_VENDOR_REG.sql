
DELIMITER //
DROP PROCEDURE IF EXISTS SP_VENDOR_REG;

CREATE PROCEDURE SP_VENDOR_REG(
	IN type VARCHAR(255),
    IN PlantId BIGINT,
    IN VendorRegId BIGINT,
    IN CompanyId BIGINT,
    IN SchemeCPDoc VARCHAR(255),
    IN SchemeVRDoc VARCHAR(255),
    IN UserId BIGINT
)
BEGIN
    IF type = 'CreateInitialize' THEN
        SELECT
            u.User_Id AS UserId,
            u.User_Name AS UserName,
            u.Password AS Password,
            u.Company_Id AS CompanyId,
            c.Company_Name AS CompanyName,
            u.Plant_Id AS PlantId,
            u.User_Code AS UserCode,
            u.Default_Role_Id AS DefaultRoleId,
            u.User_Email AS UserEmail,
            u.User_Tel_No AS UserTelNo,
            u.Status AS Status,
            u.Created_By AS CreatedBy,
            u.Created_On AS CreatedOn,
            u.Modified_By AS ModifiedBy,
            u.Modified_On AS ModifiedOn,
            u.is_blocked AS isblocked,
            u.user_image_name AS userimagename,
            u.user_image_url AS userimageurl,
            u.Gate_Id AS GateId,
            u.Secondary_Mobile_No AS SecondaryMobileNo,
            u.Address AS Address,
            u.Dept_Id AS DeptId
        FROM
            Users u
        INNER JOIN
            role r ON r.Role_Id = u.Default_Role_Id
        INNER JOIN
            Company c ON c.Company_Id = u.Company_Id
        WHERE
            u.Status = 1 and c.Check_Token is not null and c.Check_Token != ""
            AND (PlantId IS NULL OR u.Plant_Id = PlantId)
        ORDER BY
            COALESCE(u.Created_On, u.Modified_On) DESC;

        SELECT 
            Meta_Sub_Id,
            Meta_Type_Code,
            Meta_Sub_Code,
            Meta_Type_Name,
            Meta_Sub_Description,
            Status,
            Created_By,
            Created_On,
            Modified_By,
            Modified_On
        FROM
            Metadata 
        WHERE
            Meta_Type_Code = 'STA';
            
		SELECT 
            Meta_Sub_Id,
            Meta_Type_Code,
            Meta_Sub_Code,
            Meta_Type_Name,
            Meta_Sub_Description,
            Status,
            Created_By,
            Created_On,
            Modified_By,
            Modified_On
        FROM
            Metadata 
        WHERE
            Meta_Type_Code = 'APS' and Status = 1;
        
        SELECT 
            Meta_Sub_Id,
            Meta_Type_Code,
            Meta_Sub_Code,
            Meta_Type_Name,
            Meta_Sub_Description,
            Status,
            Created_By,
            Created_On,
            Modified_By,
            Modified_On
        FROM
            Metadata 
        WHERE
            Meta_Type_Code = 'DOC' and Status = 1;

        SELECT 
            Meta_Sub_Id,
            Meta_Type_Code,
            Meta_Sub_Code,
            Meta_Type_Name,
            Meta_Sub_Description,
            Status,
            Created_By,
            Created_On,
            Modified_By,
            Modified_On
        FROM
            Metadata 
        WHERE
            Meta_Sub_Code IN ('PAC', 'INS', 'AAD');
            
		select 
		ac.Approval_Configuration_Id  ApprovalConfigurationId,
		ac.Company_Id  CompanyId,
		ac.Plant_Id  PlantId,
		ac.Document_Id  DocumentId
		from
		Approval_Configuration ac
		inner join Approval_Configuration_Details acd on acd.Approval_Configuration_Id = ac.Approval_Configuration_Id 
		inner join users u on u.User_Id = acd.Primary_User_Id
		inner join Department d on d.Department_Id = u.Dept_Id
		where ac.Document_Id = 41 and ac.Status = 1 and ac.Approval_Activity_Id = 70 and ac.Plant_Id = PlantId;

        IF VendorRegId > 0 THEN
				SELECT 
                VR.Company_Id AS CompanyId,
                VR.Plant_Id AS PlantId,
                VR.Gate_Id AS GateId,
                VR.Vendor_Reg_Id AS VendorRegId,
                VR.Vendor_Reg_Code AS VendorRegCode,
                VR.Vendor_Reg_Date AS VendorRegDate,
                VR.Valid_From AS ValidFrom,
                VR.Valid_To AS ValidTo,
                VR.Insurance_Valid_From AS InsuranceValidFrom,
                VR.Insurance_Valid_To AS InsuranceValidTo,
                VR.Vendor_Name AS VendorName,
                -- VR.Work_Organizer AS WorkOrganizer,
                VR.Status_Remarks AS StatusRemarks,
                VR.Status AS Status,
                VR.Doc_Status AS DocStatus,
                VR.Created_By AS CreatedBy,
                VR.Created_On AS CreatedOn,
                VR.Modified_By AS ModifiedBy,
                VR.Modified_On AS ModifiedOn,
                ad.Primary_User_Id AS PrimaryUserId,
                u.User_Name AS PrimaryUserName
            FROM
                Vendor_Registration VR
            LEFT JOIN
                Approval_Detail ad ON ad.Document_No = VR.Vendor_Reg_Code and (ad.Primary_User_Id = UserId or ad.Secondary_User_Id = UserId )
            LEFT JOIN
                Users u ON u.User_Id = ad.Primary_User_Id
            WHERE
                VR.Vendor_Reg_Id = VendorRegId and VR.Plant_Id = PlantId
            ORDER BY
                VR.Modified_On DESC
			LIMIT 1;

            SELECT 
                wd.VR_Worker_Detail_Id AS VRWorkerDetailId,
                wd.Vendor_Reg_Id AS VendorRegId,
                wd.Worker_Name AS WorkerName,
                wd.Mail_Id AS MailId,
                wd.Mobile_No AS MobileNo,
                wd.Status AS Status,
                wd.Valid_From AS ValidFrom,
                wd.Valid_To AS ValidTo
            FROM
                VR_Worker_Detail wd
            WHERE
                wd.Vendor_Reg_Id = VendorRegId;

            SELECT 
                VRwd.Company_Id AS CompanyId,
                VRwd.Plant_Id AS PlantId,
                VRwd.Gate_Id AS GateId,
                VRwd.VR_Worker_Doc_Id AS VRWorkerDocId,
                VRwd.VR_Worker_Detail_Id AS VRWorkerDetailId,
                VRwd.Document_Type AS DocumentType,
                m.Meta_Sub_Description DocumentTypeName,
                VRwd.Document_Name AS DocumentName,
                VRwd.Document_No AS DocumentNo,
                VRwd.Document_Url AS DocumentUrl,
                CONCAT(SchemeVRDoc, VRwd.Document_Url) AS DocumentFullUrl,
                VRwd.Remarks AS Remarks,
                VRwd.Status AS Status
            FROM
                VR_Worker_Docs VRwd
			inner join Metadata m on m.Meta_Sub_Id = VRwd.Document_Type;

            SELECT 
                cd.Company_Id AS CompanyId,
                cd.Plant_Id AS PlantId,
                cd.Gate_Id AS GateId,
                cd.VR_Company_Doc_Id AS VRCompanyDocId,
                cd.Document_Type AS DocumentType,
                cd.Document_Name AS DocumentName,
                cd.Document_No AS DocumentNo,
                cd.Document_Url AS DocumentUrl,
                CONCAT(SchemeCPDoc, cd.Document_Url) AS DocumentFullUrl,
                cd.Remarks AS Remarks
            FROM
                VR_Company_Docs cd
            WHERE
                cd.Vendor_Reg_Id = VendorRegId;
        END IF;
    END IF;

    IF type = 'SearchInitialize' THEN
        -- WITH LastApproval AS (
--             SELECT 
--                 Approval_Id,
--                 MAX(Approval_Detail_Id) AS Last_Approval_Detail_Id
--             FROM 
--                 Approval_Detail
--             GROUP BY 
--                 Approval_Id
--         )
		SELECT 
    VR.Company_Id AS CompanyId,
    VR.Plant_Id AS PlantId,
    VR.Gate_Id AS GateId,
    VR.Vendor_Reg_Id AS VendorRegId,
    VR.Vendor_Reg_Code AS VendorRegCode,
    VR.Vendor_Reg_Date AS VendorRegDate,
    VR.Valid_From AS ValidFrom,
    VR.Valid_To AS ValidTo,
	VR.Insurance_Valid_From AS InsuranceValidFrom,
    VR.Insurance_Valid_To AS InsuranceValidTo,
    VR.Vendor_Name AS VendorName,
    VR.Status_Remarks AS StatusRemarks,
    VR.Status AS Status,
    VR.Doc_Status AS DocStatus,
    m1.Meta_Sub_Description AS DocStatusId,
    m.Meta_Sub_Description AS StatusName,
    VR.Created_By AS CreatedBy,
    VR.Created_On AS CreatedOn,
    VR.Modified_By AS ModifiedBy,
    VR.Modified_On AS ModifiedOn,
    MAX(ad.Status) AS ApprovalStatus,
    MAX(ad.Primary_User_Id) AS PrimaryUserId,
    MAX(ad.Approval_Id) AS ApprovalId,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM Approval_Detail ad2 
            WHERE ad2.Primary_User_Id = MAX(ad.Primary_User_Id) 
              AND ad2.Status = 75
        ) 
        THEN true 
        ELSE false 
    END AS DisableApprove
FROM 
    Vendor_Registration VR
INNER JOIN 
    Metadata m ON m.Meta_Sub_Id = VR.Status
INNER JOIN 
    Metadata m1 ON m1.Meta_Sub_Id = VR.Doc_Status
LEFT JOIN 
    Approval a ON a.Document_No = VR.Vendor_Reg_Code
LEFT JOIN 
    Approval_Detail ad ON ad.Approval_Id = a.Approval_Id
WHERE VR.Plant_Id = PlantId
GROUP BY 
    VR.Company_Id, VR.Plant_Id, VR.Gate_Id, VR.Vendor_Reg_Id, VR.Vendor_Reg_Code,
    VR.Vendor_Reg_Date, VR.Valid_From, VR.Valid_To, VR.Vendor_Name, VR.Status_Remarks,
    VR.Status, VR.Doc_Status, m1.Meta_Sub_Description, m.Meta_Sub_Description,
    VR.Created_By, VR.Created_On, VR.Modified_By, VR.Modified_On
ORDER BY 
    VR.Vendor_Reg_Date DESC;


    END IF;
END//

DELIMITER ;
