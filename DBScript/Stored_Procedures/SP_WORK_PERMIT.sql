DELIMITER //
DROP PROCEDURE IF EXISTS SP_WORK_PERMIT;

CREATE PROCEDURE SP_WORK_PERMIT(
	IN type VARCHAR(255),
    IN PlantId BIGINT,
    IN WorkPermitId BIGINT,
    IN CompanyId BIGINT,
    IN SchemeCPDoc VARCHAR(255),
    IN SchemeWPDoc VARCHAR(255),
    IN SchemeVRDoc VARCHAR(255),
    IN SchemeUserDSign VARCHAR(255),
    IN UserId BIGINT,
    IN text VARCHAR(255),
    IN EntryType INT,
    IN CategoryId VARCHAR(255),
    IN VendorId BIGINT,
    IN WPWorkerDetailId BIGINT
)
BEGIN
    IF type = 'CreateInitialize' THEN
        SELECT
            u.User_Id AS UserId,
            u.User_Name AS UserName,
            u.User_Code AS UserCode,
            u.Password AS Password,
            u.Company_Id AS CompanyId,
            c.Company_Name AS CompanyName,
            u.Plant_Id AS PlantId,
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
            Meta_Type_Code = 'STA' and status = 1;
            
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
            Meta_Type_Code = 'APS' and status = 1;

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
		 d.Department_Id as DepartmentId,
		d.Department_Name as DepartmentName, 
		d.Department_Code as DepartmentCode,
		d.Company_Id as CompanyId ,
		d.Plant_Id as PlantId ,
		d.Status as Status ,
		d.Created_By as CreatedBy ,
		d.Created_On as CreatedOn ,
		d.Modified_By as ModifiedBy ,
		d.Modified_On as ModifiedOn
		 from 
		 Department d
		 where d.Status=1 and d.Company_Id = CompanyId and d.Plant_Id = PlantId;
         
		select 
        c.Category_Id as CategoryId,
		c.Category_Name as CategoryName,
		c.Status as Status,
		c.Created_By as CreatedBy,
		c.Created_On as CreatedOn,
		c.Modified_By as ModifiedBy,
		c.Modified_On as ModifiedOn
        from 
        Category c where c.Status = 1;
        IF WorkPermitId > 0 THEN
			SELECT 
				VR.Company_Id AS CompanyId,
				VR.Plant_Id AS PlantId,
				VR.Gate_Id AS GateId,
				VR.Vendor_Reg_Id AS VendorRegId,
				VR.Vendor_Reg_Code AS VendorRegCode,
				VR.Vendor_Reg_Date AS VendorRegDate,
				VR.Valid_From AS ValidFrom,
				VR.Valid_To AS ValidTo,
				VR.Vendor_Name AS VendorName,
				-- VR.Work_Organizer AS WorkOrganizer,
				VR.Status_Remarks AS StatusRemarks,
				VR.Status AS Status,
				VR.Doc_Status AS DocStatus,
				VR.Created_By AS CreatedBy,
				VR.Created_On AS CreatedOn,
				VR.Modified_By AS ModifiedBy,
				VR.Modified_On AS ModifiedOn
			from
			Vendor_Registration vr;
		ELSE 
			SELECT 
				VR.Company_Id AS CompanyId,
				VR.Plant_Id AS PlantId,
				VR.Gate_Id AS GateId,
				VR.Vendor_Reg_Id AS VendorRegId,
				VR.Vendor_Reg_Code AS VendorRegCode,
				VR.Vendor_Reg_Date AS VendorRegDate,
				VR.Valid_From AS ValidFrom,
				VR.Valid_To AS ValidTo,
				VR.Vendor_Name AS VendorName,
				-- VR.Work_Organizer AS WorkOrganizer,
				VR.Status_Remarks AS StatusRemarks,
				VR.Status AS Status,
				VR.Doc_Status AS DocStatus,
				VR.Created_By AS CreatedBy,
				VR.Created_On AS CreatedOn,
				VR.Modified_By AS ModifiedBy,
				VR.Modified_On AS ModifiedOn
			from
			Vendor_Registration vr
			where
			vr.Status = 75;
        END IF;
        
        
        select 
		ac.Approval_Configuration_Id  ApprovalConfigurationId,
		ac.Company_Id  CompanyId,
		ac.Plant_Id  PlantId,
		ac.Document_Id  DocumentId,
		acd.Primary_User_Id PrimaryUserId,
		acd.Secondary_User_Id SecondaryUserId,
        acd.Level_Id LevelId,
		u.User_Name UserName,
        u.User_Code UserCode,
		d.Department_Id DepartmentId,
		d.Department_Name DepartmentName,
		ac.Approval_Activity_Id  ApprovalActivityId,
		ac.Status  Status,
		ac.Created_By  CreatedBy,
		ac.Created_On  CreatedOn,
		ac.Modified_By  ModifiedBy,
		ac.Modified_On ModifiedOn
		from
		Approval_Configuration ac
		inner join Approval_Configuration_Details acd on acd.Approval_Configuration_Id = ac.Approval_Configuration_Id 
		inner join users u on u.User_Id = acd.Primary_User_Id
		inner join Department d on d.Department_Id = u.Dept_Id
		where ac.Document_Id = 42 and ac.Status = 1 and ac.Approval_Activity_Id = 70 and ac.Plant_Id = PlantId;

        IF WorkPermitId > 0 THEN
				SELECT 
                wp.Company_Id AS CompanyId,
                wp.Plant_Id AS PlantId,
                wp.Gate_Id AS GateId,
                wp.Dept_Id DeptId,
                wp.Work_Permit_Id AS WorkPermitId,
                wp.Work_Permit_Code AS WorkPermitCode,
                wp.Work_Permit_Date AS WorkPermitDate,
                wp.Vendor_Reg_Id VendorRegId,
                vr.Valid_From AS ValidFrom,
                vr.Valid_To AS ValidTo,
                wp.Contract_Name AS ContractName,
                wp.Work_Organizer AS WorkOrganizer,
                wp.Po_No AS PoNo,
                wp.Status_Remarks AS StatusRemarks,
                wp.Status AS Status,
                wp.Doc_Status AS DocStatus,
                wp.Created_By AS CreatedBy,
                wp.Created_On AS CreatedOn,
                wp.Modified_By AS ModifiedBy,
                wp.Modified_On AS ModifiedOn,
                ad.Primary_User_Id AS PrimaryUserId,
                u.User_Name AS PrimaryUserName
            FROM
                Work_Permit wp
			INNER JOIN 
				Vendor_Registration vr on vr.Vendor_Reg_Id = wp.Vendor_Reg_Id
            LEFT JOIN
                Approval_Detail ad ON ad.Document_No = wp.Work_Permit_Code
            LEFT JOIN
                Users u ON u.User_Id = ad.Primary_User_Id
            WHERE
                wp.Work_Permit_Id = WorkPermitId and wp.Plant_Id = PlantId
            ORDER BY
                wp.Modified_On DESC
			LIMIT 1;

            SELECT 
                wd.WP_Worker_Detail_Id AS WPWorkerDetailId,
                wd.Work_Permit_Id AS WorkPermitId,
                wd.Worker_Name AS WorkerName,
                wd.Mail_Id AS MailId,
                wd.Mobile_No AS MobileNo,
                wd.Status AS Status,
                wd.Is_Incharge IsIncharge,
                wd.Is_Working IsWorking,
                wd.Valid_From ValidFrom,
                wd.Valid_To ValidTo
            FROM
                WP_Worker_Detail wd
            WHERE
                wd.Work_Permit_Id = WorkPermitId;

            SELECT 
                wpwd.Company_Id AS CompanyId,
                wpwd.Plant_Id AS PlantId,
                wpwd.Gate_Id AS GateId,
                wpwd.WP_Worker_Doc_Id AS WPWorkerDocId,
                wpwd.WP_Worker_Detail_Id AS WPWorkerDetailId,
                wpwd.Document_Type as DocumentType,
                m.Meta_Sub_Description DocumentTypeName,
                wpwd.Document_Name AS DocumentName,
                wpwd.Document_No AS DocumentNo,
                wpwd.Document_Url AS DocumentUrl,
                CONCAT(SchemeWPDoc, wpwd.Document_Url) AS DocumentFullUrl,
                wpwd.Remarks AS Remarks,
                wpwd.Status AS Status
            FROM
                WP_Worker_Docs wpwd
			inner join Metadata m on m.Meta_Sub_Id = wpwd.Document_Type;
                
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
			INNER JOIN Work_Permit wp on wp.Work_Permit_Id = WorkPermitId
            WHERE
                cd.Vendor_Reg_Id = wp.Vendor_Reg_Id;

            SELECT 
                cd.Company_Id AS CompanyId,
                cd.Plant_Id AS PlantId,
                cd.Gate_Id AS GateId,
                cd.WP_Category_Detail_Id AS WPCategoryDetailId,
                cd.Work_Permit_Id AS WorkPermitId,
                cd.Category_Id AS CategoryId,
                cd.Category_Name AS CategoryName,
                cd.Remark_Status AS RemarkStatus
            FROM
                WP_Category_Detail cd
            WHERE
                cd.Work_Permit_Id = WorkPermitId;
                
			select 
                wpap.Wp_Approval_Detail_Id WpApprovalDetailId,
				wpap.Work_Permit_Id WorkPermitId,
				wpap.Dept_Id DeptId,
                u.User_Name UserName,
                u.User_Code UserCode,
				d.Department_Name DepartmentName,
                wpap.Level_Id LevelId,
				wpap.Primary_User_Id PrimaryUserId,
				wpap.Secondary_User_Id SecondaryUserId,
				wpap.Digital_Sign DigitalSign,
                CONCAT(SchemeUserDSign, wpap.Digital_Sign) AS DigitalSignUrl,
				wpap.Status Status,
				wpap.Remarks1 Remarks1,
				wpap.Remarks2 Remarks2,
				wpap.Created_By CreatedBy,
				wpap.Created_On CreatedOn,
				wpap.Modified_By ModifiedBy,
				wpap.Modified_On ModifiedOn
                from
                Wp_Approval_Detail wpap
                inner join users u on u.User_Id = wpap.Primary_User_Id
				inner join Department d on d.Department_Id = u.Dept_Id
                where wpap.Work_Permit_Id = WorkPermitId;
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
--         SELECT 
--             wp.Company_Id AS CompanyId,
--             wp.Plant_Id AS PlantId,
--             wp.Gate_Id AS GateId,
--             wp.Work_Permit_Id AS WorkPermitId,
--             wp.Work_Permit_Code AS WorkPermitCode,
--             wp.Work_Permit_Date AS WorkPermitDate,
--             wp.Valid_From AS ValidFrom,
--             wp.Valid_To AS ValidTo,
--             wp.Contractor_Name AS ContractorName,
--             wp.Work_Organizer AS WorkOrganizer,
--             u.User_Name AS WorkOrganizerId,
--             wp.Po_No AS PoNo,
--             wp.Status_Remarks AS StatusRemarks,
--             wp.Status AS Status,
--             wp.Doc_Status AS DocStatus,
--             m1.Meta_Sub_Description AS DocStatusId,
--             m.Meta_Sub_Description AS StatusName,
--             wp.Created_By AS CreatedBy,
--             wp.Created_On AS CreatedOn,
--             wp.Modified_By AS ModifiedBy,
--             wp.Modified_On AS ModifiedOn,
--             ad.Status AS ApprovalStatus,
--             ad.Primary_User_Id AS PrimaryUserId
--         FROM 
--             Work_Permit wp
--         INNER JOIN 
--             Metadata m ON m.Meta_Sub_Id = wp.Status
--         INNER JOIN 
--             Metadata m1 ON m1.Meta_Sub_Id = wp.Doc_Status
--         INNER JOIN 
--             Approval a ON a.Document_No = wp.Work_Permit_Code
--         INNER JOIN 
--             LastApproval la ON la.Approval_Id = a.Approval_Id
--         INNER JOIN 
--             Approval_Detail ad ON ad.Approval_Detail_Id = la.Last_Approval_Detail_Id
--         INNER JOIN 
--             Users u ON u.User_Id = wp.Work_Organizer
--         ORDER BY 
--             WorkPermitDate DESC;

SELECT 
            wp.Company_Id AS CompanyId,
            wp.Plant_Id AS PlantId,
            wp.Gate_Id AS GateId,
            wp.Dept_Id AS DeptId,
            vr.Vendor_Name VendorName,
            vr.Insurance_Valid_To AS InsuranceValidTo,
            wp.Work_Permit_Id AS WorkPermitId,
            wp.Work_Permit_Code AS WorkPermitCode,
             CONVERT(wp.Work_Permit_Date, char(10)) AS WorkPermitDate,
            CONVERT(wp.Valid_From, char(10)) AS ValidFrom,
            CONVERT(wp.Valid_To, char(10)) AS ValidTo,
            wp.Contract_Name AS ContractName,
            wp.Work_Organizer AS WorkOrganizer,
            u.User_Name AS WorkOrganizerId,
            wp.Po_No AS PoNo,
            wp.Status_Remarks AS StatusRemarks,
            wp.Status AS Status,
            wp.Doc_Status AS DocStatus,
            m1.Meta_Sub_Description AS DocStatusId,
            m.Meta_Sub_Description AS StatusName,
            wp.Created_By AS CreatedBy,
            wp.Created_On AS CreatedOn,
            wp.Modified_By AS ModifiedBy,
            wp.Modified_On AS ModifiedOn,
            vr.Status VendorStatus
            -- ad.Primary_User_Id AS PrimaryUserId,
--             case
-- 				when a.approval_Activity_id = 70 then 'Created'
--                 when a.approval_Activity_id = 71 then 'Updated'
-- 			END AS ActivityName
            -- ad.Status AS ApprovalStatus,
        FROM 
            Work_Permit wp
		INNER JOIN 
			Vendor_Registration vr on vr.Vendor_Reg_Id = wp.Vendor_Reg_Id
        INNER JOIN 
            Metadata m ON m.Meta_Sub_Id = wp.Status
        INNER JOIN 
            Metadata m1 ON m1.Meta_Sub_Id = wp.Doc_Status
        -- left JOIN 
--             Approval a ON a.Document_No = wp.Work_Permit_Code
--         left JOIN 
--             (SELECT 
--                 Approval_Id, MAX(Approval_Detail_Id) AS Last_Approval_Detail_Id
--              FROM 
--                 Approval_Detail
--              GROUP BY 
--                 Approval_Id) AS la 
--         ON la.Approval_Id = a.Approval_Id
--         left JOIN 
--             Approval_Detail ad ON ad.Approval_Detail_Id = la.Last_Approval_Detail_Id
        INNER JOIN 
            Users u ON u.User_Id = wp.Work_Organizer
		Where wp.Plant_Id = PlantId
        ORDER BY 
            wp.Work_Permit_Date DESC;
    END IF;
	
    IF type = 'FetchVendor' THEN
        SELECT 
			VR.Company_Id AS CompanyId,
			VR.Plant_Id AS PlantId,
			VR.Gate_Id AS GateId,
			VR.Vendor_Reg_Id AS VendorRegId,
			VR.Vendor_Reg_Code AS VendorRegCode,
			VR.Vendor_Reg_Date AS VendorRegDate,
			VR.Valid_From AS ValidFrom,
			VR.Valid_To AS ValidTo,
			VR.Vendor_Name AS VendorName,
			-- VR.Work_Organizer AS WorkOrganizer,
			VR.Status_Remarks AS StatusRemarks,
			VR.Status AS Status,
			VR.Doc_Status AS DocStatus,
			VR.Created_By AS CreatedBy,
			VR.Created_On AS CreatedOn,
			VR.Modified_By AS ModifiedBy,
			VR.Modified_On AS ModifiedOn
        from
        Vendor_Registration vr
        where
        (vr.Vendor_Name like CONCAT('%', text, '%')) and 
        vr.Status = 75 and vr.Plant_Id = PlantId;
        
    END IF;
    
    IF Type = 'OnChangeDept' THEN
		
		IF WorkPermitId > 0 THEN
				select 
                wpap.Wp_Approval_Detail_Id WpApprovalDetailId,
				wpap.Work_Permit_Id WorkPermitId,
				wpap.Dept_Id DeptId,
                u.User_Name UserName,
                u.User_Code UserCode,
				d.Department_Name DepartmentName,
                wpap.Level_Id LevelId,
				wpap.Primary_User_Id PrimaryUserId,
				wpap.Secondary_User_Id SecondaryUserId,
				wpap.Digital_Sign DigitalSign,
                CONCAT(SchemeUserDSign, wpap.Digital_Sign) AS DigitalSignUrl,
				wpap.Status Status,
				wpap.Remarks1 Remarks1,
				wpap.Remarks2 Remarks2,
				wpap.Created_By CreatedBy,
				wpap.Created_On CreatedOn,
				wpap.Modified_By ModifiedBy,
				wpap.Modified_On ModifiedOn
                from
                Wp_Approval_Detail wpap
                inner join users u on u.User_Id = wpap.Primary_User_Id
				inner join Department d on d.Department_Id = u.Dept_Id
                where wpap.Work_Permit_Id = WorkPermitId;
            ELSE 
				select 
				ac.Approval_Configuration_Id  ApprovalConfigurationId,
				ac.Company_Id  CompanyId,
				ac.Plant_Id  PlantId,
				ac.Document_Id  DocumentId,
                acd.Primary_User_Id PrimaryUserId,
                acd.Level_Id LevelId,
                acd.Secondary_User_Id SecondaryUserId,
				u.User_Name UserName,
                u.User_Code UserCode,
                d.Department_Id DepartmentId,
				d.Department_Name DepartmentName,
				ac.Approval_Activity_Id  ApprovalActivityId,
				ac.Status  Status,
				ac.Created_By  CreatedBy,
				ac.Created_On  CreatedOn,
				ac.Modified_By  ModifiedBy,
				ac.Modified_On ModifiedOn
				from
				Approval_Configuration ac
				inner join Approval_Configuration_Details acd on acd.Approval_Configuration_Id = ac.Approval_Configuration_Id 
				inner join users u on u.User_Id = acd.Primary_User_Id
				inner join Department d on d.Department_Id = u.Dept_Id
				where ac.Document_Id = 42 and ac.Status = 1 and ac.Approval_Activity_Id = 70 and ac.Plant_Id = PlantId;
            end if;
    END IF;
    IF Type = 'OnChangeVendor' THEN
	
        SELECT 
                VR.Company_Id AS CompanyId,
                VR.Plant_Id AS PlantId,
                VR.Gate_Id AS GateId,
                VR.Vendor_Reg_Id AS VendorRegId,
                VR.Vendor_Reg_Code AS VendorRegCode,
                VR.Vendor_Reg_Date AS VendorRegDate,
                VR.Valid_From AS ValidFrom,
                VR.Valid_To AS ValidTo,
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
                Approval_Detail ad ON ad.Document_No = VR.Vendor_Reg_Code
            LEFT JOIN
                Users u ON u.User_Id = ad.Primary_User_Id
            WHERE
                VR.Vendor_Reg_Id = VendorId and VR.Plant_Id = PlantId
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
                wd.Valid_From as ValidFrom,
                wd.Valid_To as ValidTo,
                wd.Is_Incharge IsIncharge
            FROM
                VR_Worker_Detail wd
            WHERE
                wd.Vendor_Reg_Id = VendorId;

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
			
            IF WorkPermitId > 0 THEN
				select 
                wpap.Wp_Approval_Detail_Id WpApprovalDetailId,
				wpap.Work_Permit_Id WorkPermitId,
				wpap.Dept_Id DeptId,
                u.User_Name UserName,
                u.User_Code UserCode,
				d.Department_Name DepartmentName,
                wpap.Level_Id LevelId,
				wpap.Primary_User_Id PrimaryUserId,
				wpap.Secondary_User_Id SecondaryUserId,
				wpap.Digital_Sign DigitalSign,
                CONCAT(SchemeUserDSign, wpap.Digital_Sign) AS DigitalSignUrl,
				wpap.Status Status,
				wpap.Remarks1 Remarks1,
				wpap.Remarks2 Remarks2,
				wpap.Created_By CreatedBy,
				wpap.Created_On CreatedOn,
				wpap.Modified_By ModifiedBy,
				wpap.Modified_On ModifiedOn
                from
                Wp_Approval_Detail wpap
                inner join users u on u.User_Id = wpap.Primary_User_Id
				inner join Department d on d.Department_Id = u.Dept_Id
                where wpap.Work_Permit_Id = WorkPermitId;
            ELSE 
				select 
				ac.Approval_Configuration_Id  ApprovalConfigurationId,
				ac.Company_Id  CompanyId,
				ac.Plant_Id  PlantId,
				ac.Document_Id  DocumentId,
                acd.Level_Id LevelId,
                acd.Primary_User_Id PrimaryUserId,
                acd.Secondary_User_Id SecondaryUserId,
				u.User_Name UserName,
                u.User_Code UserCode,
                d.Department_Id DepartmentId,
				d.Department_Name DepartmentName,
				ac.Approval_Activity_Id  ApprovalActivityId,
				ac.Status  Status,
				ac.Created_By  CreatedBy,
				ac.Created_On  CreatedOn,
				ac.Modified_By  ModifiedBy,
				ac.Modified_On ModifiedOn
				from
				Approval_Configuration ac
				inner join Approval_Configuration_Details acd on acd.Approval_Configuration_Id = ac.Approval_Configuration_Id 
				inner join users u on u.User_Id = acd.Primary_User_Id
				inner join Department d on d.Department_Id = u.Dept_Id
				where ac.Document_Id = 42 and ac.Status = 1 and ac.Approval_Activity_Id = 70 and ac.Plant_Id = PlantId;
            end if;
     
    END IF;
    
    IF Type = 'FetchCheckPoints'  THEN
		IF WorkPermitId > 0 THEN
             select 
			cmap.Company_Id CompanyId,
            cmap.Plant_Id PlantId,
            cmap.Gate_Id GateId,
			cmap.CP_Map_Id CPMapId, 
			cmap.Cp_Des Description, 
            cmap.Remarks Remarks,
			cmap.Category_Id CategoryId, 
			cm.Category_Name CategoryName
			from 
			wp_cp_map_detail cmap 
            inner join category_cp_map cm on cm.Category_Id = cmap.Category_Id
            where cmap.Work_Permit_Id = WorkPermitId and
			 (CategoryId IS NULL OR CategoryId = '' OR FIND_IN_SET(cmap.Category_Id, CategoryId))
			 order by cmap.Category_Id asc;
		 ELSE 
			select 
			cmap.CP_Map_Id CPMapId, 
			cmapd.Description Description, 
			cmap.Category_Id CategoryId, 
			cmap.Category_Name CategoryName, 
			cmap.Status Status, 
			cmap.Created_By CreatedBy, 
			cmap.Created_On CreatedOn, 
			cmap.Modified_By ModifiedBy, 
			cmap.Modified_On ModifiedOn, 
			cmap.Is_Sys_Generated IsSysGenerated
			from 
			Category_Cp_Map cmap 
			inner join category_cp_map_details cmapd on cmapd.CP_Map_Id = cmap.CP_Map_Id
			where cmap.Status = 1 and
			 (CategoryId IS NULL OR CategoryId = '' OR FIND_IN_SET(cmap.Category_Id, CategoryId))
			 order by cmap.Category_Id asc;
		END IF;
    END IF;
    IF Type = 'GetPass' THEN
		SELECT 
                wp.Company_Id AS CompanyId,
                wp.Plant_Id AS PlantId,
                p.Plant_Name AS PlantName,
                wp.Gate_Id AS GateId,
                wp.Dept_Id DeptId,
                wp.Work_Permit_Id AS WorkPermitId,
                wp.Work_Permit_Code AS WorkPermitCode,
                wp.Work_Permit_Date AS WorkPermitDate,
                wp.Vendor_Reg_Id VendorRegId,
                wp.Valid_From AS ValidFrom,
                wp.Valid_To AS ValidTo,
                wp.Contract_Name AS ContractName,
                wp.Work_Organizer AS WorkOrganizer,
                u.User_Name as WorkOrganizerName,
                wp.Po_No AS PoNo,
                wp.Status_Remarks AS StatusRemarks,
                wp.Status AS Status,
                wp.Doc_Status AS DocStatus,
                wp.Created_By AS CreatedBy,
                wp.Created_On AS CreatedOn,
                wp.Modified_By AS ModifiedBy,
                wp.Modified_On AS ModifiedOn,
                wd.WP_Worker_Detail_Id AS WPWorkerDetailId,
                wd.Work_Permit_Id AS WorkPermitId,
                wd.Worker_Name AS WorkerName,
                wd.Mail_Id AS MailId,
                wd.Mobile_No AS MobileNo,
                wd.Status AS WorkerStatus,
                wd.Is_Incharge IsIncharge,
                wd.Is_Working IsWorking,
                vr.Vendor_Name VendorName,
                ifnull(vl.Checked_In,null) CheckedIn,
				ifnull(vl.Checked_Out,null) CheckedOut,
                wd.Profile_Img_Name ProfileImgName,
                CONCAT(SchemeCPDoc, wd.Profile_Img_Url) AS ProfileImgUrl,
                wd.Is_Edited_Image IsEditedImage,
                wd.Valid_From AS WpValidFrom,
                wd.Valid_To AS WpValidTo
            FROM
                Work_Permit wp
			INNER JOIN 
				WP_Worker_Detail wd on wd.Work_Permit_Id = wp.Work_Permit_Id
			LEFT JOIN Plant p on p.Plant_Id = wp.Plant_Id
			INNER JOIN 
				Vendor_Registration vr on vr.Vendor_Reg_Id = wp.Vendor_Reg_Id
			INNER JOIN 
				Users u on u.User_Id = wp.Work_Organizer
			left join
				Visitor_Entry_Log vl on vl.Visitor_Entry_Detail_Id = wd.WP_Worker_Detail_Id and date(vl.Checked_In) = curdate()
            WHERE
                wp.Work_Permit_Id = WorkPermitId and wd.WP_Worker_Detail_Id = WPWorkerDetailId and wp.Plant_Id = PlantId and p.Check_Token is not null and p.Check_Token != "";
			
            
            SELECT 
                wp.Company_Id AS CompanyId,
                wp.Plant_Id AS PlantId,
                wp.Gate_Id AS GateId,
                wp.Dept_Id DeptId,
                wp.Work_Permit_Id AS WorkPermitId,
                wp.Work_Permit_Code AS WorkPermitCode,
                wp.Work_Permit_Date AS WorkPermitDate,
                wp.Vendor_Reg_Id VendorRegId,
                wp.Valid_From AS ValidFrom,
                wp.Valid_To AS ValidTo,
                wp.Contract_Name AS ContractName,
                wp.Work_Organizer AS WorkOrganizer,
                wp.Po_No AS PoNo,
                wp.Status_Remarks AS StatusRemarks,
                wp.Status AS Status,
                wp.Doc_Status AS DocStatus,
                wp.Created_By AS CreatedBy,
                wp.Created_On AS CreatedOn,
                wp.Modified_By AS ModifiedBy,
                wp.Modified_On AS ModifiedOn
            FROM
                Work_Permit wp
            WHERE
                wp.Work_Permit_Id = WorkPermitId
            ORDER BY
                wp.Modified_On DESC;

            SELECT 
                wd.WP_Worker_Detail_Id AS WPWorkerDetailId,
                wd.Work_Permit_Id AS WorkPermitId,
                wd.Worker_Name AS WorkerName,
                wd.Mail_Id AS MailId,
                wd.Mobile_No AS MobileNo,
                wd.Status AS Status,
                wd.Is_Incharge IsIncharge,
                wd.Profile_Img_Name ProfileImgName,
                CONCAT(SchemeCPDoc, wd.Profile_Img_Url) AS ProfileImgUrl,
                wd.Is_Edited_Image IsEditedImage,
                wd.Is_Working IsWorking,
                wd.Valid_From ValidFrom,
                wd.Valid_To ValidTo
            FROM
                WP_Worker_Detail wd
            WHERE
                wd.Work_Permit_Id = WorkPermitId and wd.WP_Worker_Detail_Id = WPWorkerDetailId;
			
            SELECT 
                wpwd.Company_Id AS CompanyId,
                wpwd.Plant_Id AS PlantId,
                wpwd.Gate_Id AS GateId,
                wpwd.WP_Worker_Doc_Id AS WPWorkerDocId,
                wpwd.WP_Worker_Detail_Id AS WPWorkerDetailId,
                wpwd.Document_Name AS DocumentName,
                wpwd.Document_Type as DocumentType,
                m.Meta_Sub_Description DocumentTypeName,
                wpwd.Document_No AS DocumentNo,
                wpwd.Document_Url AS DocumentUrl,
                CONCAT(SchemeWPDoc, wpwd.Document_Url) AS DocumentFullUrl,
                wpwd.Remarks AS Remarks,
                wpwd.Status AS Status
            FROM
                WP_Worker_Docs wpwd 
			inner join Metadata m on m.Meta_Sub_Id = wpwd.Document_Type
			where wpwd.WP_Worker_Detail_Id = WPWorkerDetailId;
		
			select 
                wpap.Wp_Approval_Detail_Id WpApprovalDetailId,
				wpap.Work_Permit_Id WorkPermitId,
				wpap.Dept_Id DeptId,
				wpap.Primary_User_Id PrimaryUserId,
				wpap.Secondary_User_Id SecondaryUserId,
				wpap.Status Status,
				wpap.Remarks1 Remarks1,
				wpap.Remarks2 Remarks2,
				wpap.Created_By CreatedBy,
				wpap.Created_On CreatedOn,
				wpap.Modified_By ModifiedBy,
				wpap.Modified_On ModifiedOn
                from
                Wp_Approval_Detail wpap
                where wpap.Work_Permit_Id = WorkPermitId;

            SELECT 
                cd.Company_Id AS CompanyId,
                cd.Plant_Id AS PlantId,
                cd.Gate_Id AS GateId,
                cd.WP_Category_Detail_Id AS WPCategoryDetailId,
                cd.Work_Permit_Id AS WorkPermitId,
                cd.Category_Id AS CategoryId,
                cd.Category_Name AS CategoryName,
                cd.Remark_Status AS RemarkStatus
            FROM
                WP_Category_Detail cd
            WHERE
                cd.Work_Permit_Id = WorkPermitId;

    END IF; 
	if type='FilterWorkPermitCode'
	then
		if EntryType=60
		then
			-- Check In
			SELECT
				wp.Work_Permit_Code AS WorkPermitCode,
				wd.Wp_Worker_Detail_Id AS WpWorkerDetailId,
				wd.Worker_Name AS PersonName
			FROM
				Work_Permit wp
				INNER JOIN Wp_Worker_Detail wd ON wd.Work_Permit_Id = wp.Work_Permit_Id
			WHERE
				Work_Permit_Code LIKE CONCAT('%',text, '%')
				AND wp.Status = 75
				AND CURDATE() BETWEEN DATE(wd.Valid_From) AND COALESCE(DATE(wd.Valid_To), CURDATE())
				AND wp.Plant_Id = PlantId
				AND NOT EXISTS (
					SELECT 1
					FROM Visitor_Entry_Log v
					WHERE v.Visitor_Entry_Code = wp.Work_Permit_Code
						AND v.Visitor_Entry_Detail_Id = wd.Wp_Worker_Detail_Id
						AND Checked_In IS NOT NULL
						AND DATE(Created_On) = CURDATE()
				)
			GROUP BY
				Work_Permit_Code, wd.Wp_Worker_Detail_Id, wd.Worker_Name
			ORDER BY
				Created_On DESC, Modified_On DESC
			LIMIT 10;

			-- Check Out -- 5 min Less
			select 
			Work_Permit_Code WorkPermitCode,
			wd.Wp_Worker_Detail_Id WpWorkerDetailId,
			wd.Worker_Name PersonName
			from Work_Permit wp 
			inner join Wp_Worker_Detail wd on wd.Work_Permit_Id=wp.Work_Permit_Id
			where 
			Work_Permit_Code like concat('%',text,'%') and wp.Status=75 and
			curdate() BETWEEN date(wd.Valid_From) AND COALESCE (date(wd.Valid_To), curdate())
			and wp.Plant_Id = PlantId  and
			exists(
				select 1 from Visitor_Entry_Log v 
				where v.Visitor_Entry_Code=wp.Work_Permit_Code and v.Visitor_Entry_Detail_Id=wd.Wp_Worker_Detail_Id and 
				Checked_In is not null and Checked_Out is null and date(Created_On)= curdate()
				AND TIMESTAMPDIFF(MINUTE, Checked_In, NOW()) <= 5
			)
			order by Created_On,Modified_On desc
            limit 10;

			-- Check Out -- 5 min More
			select 
			Work_Permit_Code WorkPermitCode,
			wd.Wp_Worker_Detail_Id WpWorkerDetailId,
			wd.Worker_Name PersonName
			from Work_Permit wp 
			inner join Wp_Worker_Detail wd on wd.Work_Permit_Id=wp.Work_Permit_Id
			where 
			Work_Permit_Code like concat('%',text,'%') and wp.Status=75 and
			curdate() BETWEEN date(wd.Valid_From) AND COALESCE(date(wd.Valid_To), curdate())
			and wp.Plant_Id = PlantId  and
			exists(
				select 1 from Visitor_Entry_Log v 
				where v.Visitor_Entry_Code=wp.Work_Permit_Code and v.Visitor_Entry_Detail_Id=wd.Wp_Worker_Detail_Id and 
				Checked_In is not null and Checked_Out is null and date(Created_On)= curdate()
				AND TIMESTAMPDIFF(MINUTE, Checked_In, NOW()) >= 5
			)
			order by Created_On,Modified_On desc
            limit 10;

			-- Check In/ Out
			select
			Work_Permit_Code WorkPermitCode,
			wd.Wp_Worker_Detail_Id WpWorkerDetailId,
			wd.Worker_Name PersonName
			from Work_Permit wp 
			inner join Wp_Worker_Detail wd on wd.Work_Permit_Id=wp.Work_Permit_Id
			where 
			Work_Permit_Code like concat('%',text,'%') and wp.Status=75 and
			curdate() BETWEEN date(wd.Valid_From) AND COALESCE(date(wd.Valid_To), curdate())
			and wp.Plant_Id = PlantId  and
			exists(
				select 1 from Visitor_Entry_Log v 
				where v.Visitor_Entry_Code=wp.Work_Permit_Code and v.Visitor_Entry_Detail_Id=wd.Wp_Worker_Detail_Id and 
				Checked_In is not null and Checked_Out is not null and date(Created_On) = curdate()
			)
			order by Created_On,Modified_On desc
            limit 10;

			select
			ad.Approval_Detail_Id ApprovalDetailId,
			ad.Approval_Id ApprovalId,
			ad.Document_Id DocumentId,
			ad.Document_No DocumentNo,
			ad.Level_Id LevelId,
			ad.Primary_User_Id PrimaryUserId,
			ad.Status Status,
			ad.Remarks1 Remarks1,
			ad.Remarks2 Remarks2,
			ad.Created_By CreatedBy,
			ad.Created_On CreatedOn,
			ad.Modified_By ModifiedBy,
			ad.Modified_On ModifiedOn,
			ad.Is_Viewed IsViewed,
			ad.Secondary_User_Id SecondaryUserId
			from
			Approval_Detail ad;
		end if;
	end if;
END//

DELIMITER ;
