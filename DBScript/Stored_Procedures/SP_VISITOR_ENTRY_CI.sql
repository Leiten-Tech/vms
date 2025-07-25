DROP PROCEDURE IF EXISTS SP_VISITOR_ENTRY_CI;
DELIMITER //
create procedure SP_VISITOR_ENTRY_CI
(
	IN VisitorEntryId BIGINT,
    IN VisitorDetailId BIGINT,
    IN VisitorDetailIds VARCHAR(255),
    IN VisitorEntryCode VARCHAR(255),
    IN VisitorTypeId BIGINT ,
    IN PlantId BIGINT,
    IN VisitorId BIGINT,
    IN type VARCHAR(255),
    IN text VARCHAR(255),
    IN Scheme VARCHAR(255),
    IN SchemeVehicle VARCHAR(255),
    IN SchemeDetail VARCHAR(255),
    IN SchemeDoc VARCHAR(255),
    IN EntryType INT,
    IN PartyType INT,
    IN Visitor_Type_Id INT,
    IN CompanyId INT,
    IN VehicleData VARCHAR(255),
    IN DeptId BIGINT,
    IN UserId BIGINT,
    IN DetailId INT,
    IN RoleId BIGINT,
    IN WorkPermitId BIGINT,
    IN WorkPermitCode VARCHAR(100),
    IN VehicleNo VARCHAR(100)
)

begin
	SET VisitorTypeId = COALESCE(VisitorTypeId, 35);
	IF type='CreateInitialize'
	THEN
     
		select * from Metadata where Meta_Type_Code='VIY';
		select * from Metadata where Meta_Type_Code='YRN';
		select * from Metadata where Meta_Type_Code='IDT';
		select * from Metadata where Meta_Type_Code='STA';
		select * from Metadata where Meta_Type_Code='TTL';
		select * from Metadata where Meta_Type_Code='DCT';
        select * from Metadata where Meta_Type_Code='VTY';
        select * from Metadata where Meta_Type_Code='REF';
		select
		u.User_Id UserId,
		CONCAT(u.User_Name , '(', u.User_Code ,')') UserName,
		u.Password Password,
		u.Company_Id CompanyId,
		u.Plant_Id PlantId,
		u.User_Code UserCode,
		u.Default_Role_Id DefaultRoleId,
		u.User_Email UserEmail,
		u.User_Tel_No UserTelNo,
		u.Status Status,
		u.Created_By CreatedBy,
		u.Created_On CreatedOn,
		u.Modified_By ModifiedBy,
		u.Modified_On ModifiedOn,
		u.is_blocked isblocked,
		u.user_image_name userimagename,
		u.user_image_url userimageurl,
		u.Gate_Id GateId,
		u.Secondary_Mobile_No SecondaryMobileNo,
		u.Address Address,
		u.Dept_Id DeptId
		from users u 
		inner join role r on r.Role_Id = u.Default_Role_Id
		where u.Default_Role_Id = 6 and u.Status = 1; -- Driver;

		select
		u.User_Id UserId,
		u.User_Name UserName,
		u.Password Password,
		u.Company_Id CompanyId,
		c.Company_Name CompanyName,
		u.Plant_Id PlantId,
		u.User_Code UserCode,
		u.Default_Role_Id DefaultRoleId,
		u.User_Email UserEmail,
		u.User_Tel_No UserTelNo,
		u.Status Status,
		u.Created_By CreatedBy,
		u.Created_On CreatedOn,
		u.Modified_By ModifiedBy,
		u.Modified_On ModifiedOn,
		u.is_blocked isblocked,
		u.user_image_name userimagename,
		u.user_image_url userimageurl,
		u.Gate_Id GateId,
		u.Secondary_Mobile_No SecondaryMobileNo,
		u.Address Address,
		u.Dept_Id DeptId
		from Users u 
		inner join role  r  on r.Role_Id=u.Default_Role_Id 
		inner join Company c  on c.Company_Id = u.Company_Id
		where u.Status=1  -- and c.Check_Token is not null and c.Check_Token != "" 
        and 
         (
			RoleId = 1 
			or (RoleId != 1 and u.Company_Id = CompanyId)
		 )
		and (PlantId IS NULL OR u.Plant_Id = PlantId)
		order by ifnull(u.Created_On, u.Modified_On) desc;

		select * from Department d where d.Status=1 and d.Company_Id = CompanyId;

		-- Visitor List 
        SELECT 
		v.Visitor_Id AS VisitorId,
		vd.Visitor_Detail_Id AS VisitorDetailId,
		vd.visitor_detail_Code AS VisitorCode,
		vd.visitor_detail_Code AS VisitorDetailCode,
		v.Visitor_Type_Id AS VisitorTypeId,
		v.Company_Id AS CompanyId,
		v.Plant_Id AS PlantId,
		v.Country_Id AS CountryId,
		v.State_Id AS StateId,
		v.City_Id AS CityId,
		v.Title_id AS Titleid,
		CONCAT(vd.First_Name, ' ', vd.Last_Name) AS FirstName,
		vd.Last_Name AS LastName,
		v.Dob,
		v.Visitor_Company AS VisitorCompany,
		v.Address,
		vd.Mail_Id AS MailId,
		vd.Mobile_No AS MobileNo,
		vd.Tag_No AS TagNo,
		vd.Visitor_Company AS VisitorCompany,
		v.Id_Card_Type AS IdCardType,
		v.Id_Card_No AS IdCardNo,
		v.Document_Name AS DocumentName,
		v.Document_Url AS DocumentUrl,
		vd.Digital_Sign_Name AS DigitalSignName,
		vd.Digital_Sign_URL AS DigitalSignURL,
		vd.Signed_Version AS SignedVersion,
		vd.Is_Terms_Agreed AS IsTermsAgreed,
		v.Status,
		v.Created_By AS CreatedBy,
		v.Created_On AS CreatedOn,
		v.Modified_By AS ModifiedBy,
		v.Modified_On AS ModifiedOn
		FROM 
			Visitor v
		INNER JOIN 
			Metadata m ON m.Meta_Sub_Id = v.Title_id
		INNER JOIN 
			visitor_detail vd ON v.Visitor_Id = vd.Visitor_Id
		INNER JOIN (
			SELECT 
				vd2.Mobile_No,
				MAX(COALESCE(v2.Created_On, v2.Modified_On)) AS LastUpdated
			FROM 
				visitor_detail vd2
			INNER JOIN Visitor v2 ON v2.Visitor_Id = vd2.Visitor_Id
			WHERE 
				v2.Visitor_Type_Id = VisitorTypeId
				AND v2.Company_Id = CompanyId
				AND (
					RoleId = 2 OR 
					(RoleId <> 2 AND v2.Status = 1)
				)
			GROUP BY 
				vd2.Mobile_No
		) AS LatestVisitors ON vd.Mobile_No = LatestVisitors.Mobile_No
		AND COALESCE(v.Created_On, v.Modified_On) = LatestVisitors.LastUpdated
		WHERE 
			v.Visitor_Type_Id = VisitorTypeId AND v.Plant_Id = PlantId
			AND v.Company_Id = CompanyId
			AND (
				RoleId = 2 OR 
				(RoleId <> 2 AND v.Status = 1)
			)
		ORDER BY 
			COALESCE(v.Created_On, v.Modified_On) DESC
		LIMIT 20;

		-- SELECT 
-- 		v.Visitor_Id AS VisitorId,
-- 		vd.Visitor_Detail_Id AS VisitorDetailId,
-- 		vd.visitor_detail_Code AS VisitorCode,
-- 		vd.visitor_detail_Code AS VisitorDetailCode,
-- 		v.Visitor_Type_Id AS VisitorTypeId,
-- 		v.Company_Id AS CompanyId,
-- 		v.Plant_Id AS PlantId,
-- 		v.Country_Id AS CountryId,
-- 		v.State_Id AS StateId,
-- 		v.City_Id AS CityId,
-- 		v.Title_id AS Titleid,
-- 		CONCAT(vd.First_Name, ' ', vd.Last_Name) AS FirstName,
-- 		vd.Last_Name AS LastName,
-- 		v.Dob,
-- 		v.Visitor_Company AS VisitorCompany,
-- 		v.Address,
-- 		vd.Mail_Id AS MailId,
-- 		vd.Mobile_No AS MobileNo,
-- 		v.Id_Card_Type AS IdCardType,
-- 		v.Id_Card_No AS IdCardNo,
-- 		v.Document_Name AS DocumentName,
-- 		v.Document_Url AS DocumentUrl,
-- 		v.Status,
-- 		v.Created_By AS CreatedBy,
-- 		v.Created_On AS CreatedOn,
-- 		v.Modified_By AS ModifiedBy,
-- 		v.Modified_On AS ModifiedOn
-- 	FROM 
-- 		Visitor v
-- 	INNER JOIN 
-- 		Metadata m ON m.Meta_Sub_Id = v.Title_id
-- 	INNER JOIN 
-- 		visitor_detail vd ON v.Visitor_Id = vd.Visitor_Id
-- 	WHERE 
-- 		v.Visitor_Type_Id = VisitorTypeId 
-- 		AND v.Company_Id = CompanyId
-- 		AND (
-- 			RoleId = 2 OR 
-- 			(RoleId <> 2 AND v.Status = 1)
-- 		)
-- 		AND vd.Mobile_No IN (
-- 			SELECT vd2.Mobile_No
-- 			FROM visitor_detail vd2
-- 			INNER JOIN Visitor v2 ON v2.Visitor_Id = vd2.Visitor_Id
-- 			WHERE 
-- 				v2.Visitor_Type_Id = VisitorTypeId
-- 				AND v2.Company_Id = CompanyId
-- 				AND (
-- 					RoleId = 2 OR 
-- 					(RoleId <> 2 AND v2.Status = 1)
-- 				)
-- 			ORDER BY 
-- 				COALESCE(v2.Created_On, v2.Modified_On) DESC
-- 			LIMIT 20
-- 		)
-- 	ORDER BY 
-- 		COALESCE(v.Created_On, v.Modified_On) DESC
-- 	LIMIT 20;


		SELECT 
		v.Visitor_Id VisitorId,
        vd.Visitor_Detail_Id VisitorDetailId,
		-- v.Visitor_Code Visitor_Code,
        vd.visitor_detail_Code VisitorCode,
        vd.visitor_detail_Code VisitorDetailCode,
		v.Visitor_Type_Id VisitorTypeId,
		v.Company_Id CompanyId,
		v.Plant_Id PlantId,
		v.Country_Id CountryId,
		v.State_Id StateId,
		v.City_Id CityId,
		v.Title_id Titleid,
		CONCAT(vd.First_Name,' ',vd.Last_Name) AS FirstName,
		vd.Last_Name LastName,
		v.Dob,
		v.Visitor_Company VisitorCompany,
		v.Address,
		vd.Mail_Id MailId,
		vd.Mobile_No MobileNo,
        vd.Tag_No TagNo,
        vd.Visitor_Company VisitorCompany,
		v.Id_Card_Type IdCardType,
		v.Id_Card_No IdCardNo,
		v.Document_Name DocumentName,
		v.Document_Url DocumentUrl,
		        vd.Digital_Sign_Name AS DigitalSignName,
        vd.Digital_Sign_URL AS DigitalSignURL,
        vd.Signed_Version AS SignedVersion,
        vd.Is_Terms_Agreed AS IsTermsAgreed,
		v.Status,
		v.Created_By CreatedBy,
		v.Created_On CreatedOn,
		v.Modified_By ModifiedBy,
		v.Modified_On ModifiedOn
		FROM 
			Visitor v
		INNER JOIN 
			Metadata m ON m.Meta_Sub_Id = v.Title_id
		INNER JOIN 
			visitor_detail vd ON v.Visitor_Id = vd.Visitor_Id
		WHERE 
			v.Status = 1 
            and v.Plant_Id = PlantId 
            and v.Company_Id = CompanyId
		ORDER BY 
			COALESCE(v.Created_On, v.Modified_On) DESC;

		select * from Metadata where Meta_Type_Code='PTY';
		select * from Area a where a.Status=1 and a.Company_Id = CompanyId  and a.Plant_Id = PlantId;
		select * from Route r where Status=1 and r.Company_Id = CompanyId  and r.Plant_Id = PlantId;
		-- select concat(Vehicle_Name,' ( ',Vehicle_No,' ) ') VehicleNameAndNo,
-- 		Vehicle_Name VehicleName,
-- 		Vehicle_No VehicleNo from Vehicle where Status=1;
select
		v.Visitor_Entry_Id VisitorEntryId,
		v.Visitor_Entry_Code VisitorEntryCode,
		v.Visitor_Entry_Date VisitorEntryDate,
		v.Company_Id CompanyId,
		v.Plant_Id PlantId,
		v.Gate_Id GateId,
		v.Visitor_Type_Id VisitorTypeId,
		m.Meta_Sub_Description VisitorTypeName,
		v.Visitor_Id VisitorId,
		-- v.Person_Name PersonName,
		vd.First_Name PersonName,
		v.Mobile_No MobileNo,
      --   v.Aadhar_No AadharNo,
		v.Id_Proof_Type IdProofType,
		v.Id_Proof_No IdProofNo,
		v.Visited_Employee_Id VisitedEmployeeId,
		concat(vd.First_Name , ' ' ,vd.Last_Name) PersonToVisit,
		v.Valid_From ValidFrom,
		v.Valid_To ValidTo,
		v.Access_Type AccessType,
		v.Is_Extended IsExtended,
		v.Status Status,
		m3.Meta_Sub_Description StatusName,
		u.User_Name CreatedbyName,
		CONVERT(v.Created_On, CHAR(19) ) CreatedOn,
		ifnull(CONVERT(v.Modified_On  , CHAR(19) ),
		CONVERT(v.Created_On , CHAR(19) )) ModifiedOn,
		ifnull(u.User_Name,u1.User_Name) ModifiedByName,
		v.Modified_By ModifiedBy,
		v.Is_Appointment_booking IsAppointmentBooking,
		v.Is_Pre_Booking IsPreBooking,
		v.Visitor_Image_Name,
		concat(Scheme,v.Visitor_Image_Name) VisitorImageUrl,
        CASE
		WHEN vl.Checked_In IS NOT NULL AND vl.Checked_Out IS NULL THEN 0
		ELSE 1
		END AS CheckOut,
		vd.Visitor_Entry_Detail_Id VisitorEntryDetailId,
		v.Purpose_Of_Visit PurposeOfVisit,
		m4.Meta_Sub_Description PurposeOfVisitName,
        v.Vehicle_No VehicleNo,
        v.Vehicle_Type_Id VehicleTypeId,
        v.Entry_Type EntryType,
        v.Entry_Time EntryTime,
        v.Exit_Time ExitTime,
        v.Vehicle_Name VehicleName,
        v.Vehicle_Model VehicleModel,
        v.Driver_Id DriverId,
        v.Driver_Name DriverName,
		m1.Meta_Sub_Description VehicleTypeName
		from Visitor_Entry v 
		inner join Metadata m on m.Meta_Sub_Id=v.Visitor_Type_Id
		inner join Metadata m3 on m3.Meta_Sub_Id=v.Status
		inner join Metadata m4 on m4.Meta_Sub_Id=v.Purpose_Of_Visit
        left join metadata m1 on m1.Meta_Sub_iD = V.Vehicle_Type_Id
		inner join Users u on u.User_Id=v.Created_By
		left join Users u1 on u1.User_Id=v.Modified_By
        left join Users ud1 on ud1.User_Id=v.Driver_Id
		left join Visitor_Entry_Log vl on vl.Visitor_Entry_Code=v.Visitor_Entry_Code  -- and v.Visitor_Type_Id=35
		left join Visitor_Entry_Detail vd on vd.Visitor_Entry_Id=v.Visitor_Entry_Id -- and v.Visitor_Type_Id=35 
        -- and v.Is_Appointment_Booking = 1 -- and (v.Is_Internal_Appointment = 0 AND v.Is_Internal_Appointment IS NOT NULL)
		where v.Company_Id = CompanyId and v.Plant_Id  = PlantId and
		 v.Visitor_Type_Id=66 and (v.Status = 75 or v.Status = 1)
         -- and curdate() between date(vd.Valid_From) and COALESCE(DATE(vd.Valid_To), date(vd.Valid_From))
		order by ifnull(v.Modified_On,v.Created_On) desc;
        
		select * from Material m where m.Status = 1;
        IF VisitorTypeId = 66 THEN
			select * from Metadata where Meta_Type_Code='POVV' and Status=1;
		ELSE
			select * from Metadata where Meta_Type_Code='POV' and Status=1;
		END IF;
        
		select 
		p.Plant_Id PlantId,
		p.Plant_Code PlantCode,
		p.Plant_Name PlantName,
		p.Plant_Type PlantType,
		p.Address Address,
		p.Geo_Location GeoLocation,
		p.Country_Id CountryId,
		p.city_Id cityId,
		p.State_Id StateId,
		p.Company_Id CompanyId,
		p.Status StatusName,
		p.Created_By CreatedBy,
		p.Created_On CreatedOn,
		p.Modified_By ModifiedBy,
		p.Modified_On ModifiedOn
		from Plant p
		where p.company_id = CompanyId
		and p.status = 1 ;-- and p.Check_Token is not null and p.Check_Token != "";

		select 
		wp.Company_Id CompanyId,
		wp.Plant_Id PlantId,
		wp.Gate_Id GateId,
		wp.Work_Permit_Id WorkPermitId,
		wp.Work_Permit_Code WorkPermitCode,
		CONVERT(  wp.Work_Permit_Date, CHAR(19)) WorkPermitDate,
		CONVERT(wp.Valid_From, CHAR(19))  ValidFrom,
		CONVERT(wp.Valid_To, CHAR(19))  ValidTo,
		wp.Contract_Name ContractName,
		wp.Work_Organizer WorkOrganizer,
		wp.Po_No PoNo,
		wp.Status_Remarks StatusRemarks,
		wp.Status Status,
		m.Meta_Sub_Description StatusName,
		wp.Created_By CreatedBy,
		wp.Created_On CreatedOn,
		wp.Modified_By ModifiedBy,
		wp.Modified_On ModifiedOn
		from
		Work_Permit wp
		inner join Metadata m on m.Meta_Sub_Id = wp.Status
		where wp.Status = 75
		-- inner join Approval a on a.Document_No = wp.Work_Permit_Code
		-- inner join Approval_Detail ad on ad.Approval_Id = a.Approval_Id
		order by WorkPermitDate desc;
        
      SELECT
		   i.Instructions_Id AS InstructionsId,
           i.Company_Id AS CompanyId,
           i.Plant_Id AS PlantId,
           i.Instruction_Name AS InstructionName,
           i.Visitor_Type_Id AS VisitorTypeId,
           i.Points AS Points,
           i.Version AS Version,
           i.Is_Enabled AS IsEnabled,
           i.Status AS Status
		FROM Instructions i
        WHERE i.Visitor_Type_Id=35
        order by i.Version desc
        lIMIT 1;

		if VisitorEntryId>0
		THEN
			SELECT
			ve.Company_Id AS CompanyId,
			ve.Plant_Id AS PlantId,
			ve.Gate_Id AS GateId,
			ve.Visitor_Entry_Id AS VisitorEntryId,
			ve.Visitor_Entry_Code AS VisitorEntryCode,
			ve.Visitor_Entry_Date AS VisitorEntryDate,
			ve.Visitor_Type_Id AS VisitorTypeId,
			m.Meta_Sub_Description AS VisitorTypeName,
			ve.Visitor_Id AS VisitorId,
			v.Visitor_Code AS VisitorCode,
			v.Visitor_Company AS VisitorCompany,
			ve.Person_Name AS PersonName,
			ve.Mobile_No AS MobileNo,
            ve.Aadhar_No AS AadharNo,
			ve.Id_Proof_Type AS IdProofType,
			ve.Id_Proof_No AS IdProofNo,
			ve.Visited_Employee_Id AS VisitedEmployeeId,
			CONCAT(vd.First_Name, ' ',vd.Last_Name) AS PersonToVisit,
			ve.Valid_From AS ValidFrom,
			ve.Valid_To AS ValidTo,
			ve.Access_Type AS AccessType,
			ve.Is_Extended AS IsExtended,
			ve.Is_Appointment_Booking AS IsAppointmentBooking,
			ve.Is_Pre_Booking AS IsPreBooking,
			ve.Visitor_Remarks AS VisitorRemarks,
			ve.Purpose_Of_Visit AS PurposeOfVisit,
			m4.Meta_Sub_Description AS PurposeOfVisitName,
			ve.Visitor_Image_Name AS VisitorImageName,
			CONCAT(Scheme,ve.Visitor_Image_Name) AS VisitorImageUrl,
			(
				SELECT GROUP_CONCAT(DISTINCT m.Area_Name SEPARATOR ', ') AS AreaToVisitName
				FROM Visitor_Entry_Atv_Detail B
				INNER JOIN Area m ON m.Area_Id = b.Area_To_Visit
				WHERE B.Visitor_Entry_Id = ve.Visitor_Entry_Id
			) AS AreaToVisitName,
			(
				SELECT GROUP_CONCAT(DISTINCT CONCAT(bd.Device_Name,' - ',bd.Device_No) SEPARATOR ', ')
				FROM Visitor_Entry_Belonging_Detail bd
				WHERE bd.Visitor_Entry_Id = ve.Visitor_Entry_Id
				GROUP BY bd.Device_Name, bd.Device_No
			) AS BelongingDetails,
			ve.Dc_Number AS DcNumber,
			ve.Party_Type AS PartyType,
			ve.Party_Name AS PartyName,
			ve.Invoice_Number AS InvoiceNumber,
			ve.Po_Number AS PoNumber,
			ve.Container_Number AS ContainerNumber,
			ve.Is_Existing_Vehicle AS IsExistingVehicle,
			ve.Vehicle_Name AS VehicleName,
			ve.Vehicle_No AS VehicleNo,
			ve.Number_Of_Passengers AS NumberOfPassengers,
			ve.Is_Existing_Driver AS IsExistingDriver,
			ve.Driver_Id AS DriverId,
			ve.Vehicle_Document_Name AS VehicleDocumentName,
			CONCAT(SchemeVehicle, ve.Vehicle_Document_Name) AS VehicleDocumentUrl,
			vd.Digital_Sign_Name AS DigitalSignName,
            vd.Digital_Sign_URL AS DigitalSignURL,
            vd.Signed_Version AS SignedVersion,
            vd.Is_Terms_Agreed AS IsTermsAgreed,
			ve.Route_Id AS RouteId,
			ve.Starting_Km AS StartingKm,
			ve.Ending_Km AS EndingKm,
			ve.Status AS Status,
			ve.Created_By AS CreatedBy,
			ve.Created_On AS CreatedOn,
			ve.Modified_By AS ModifiedBy,
			ve.Modified_On AS ModifiedOn
		FROM
			Visitor_Entry ve
			INNER JOIN Metadata m ON m.Meta_Sub_Id = ve.Visitor_Type_Id
			INNER JOIN Metadata m4 ON m4.Meta_Sub_Id = ve.Purpose_Of_Visit
			INNER JOIN Visitor v ON v.Visitor_Id = ve.Visitor_Id
			LEFT JOIN Visitor_Entry_Detail vd ON vd.Visitor_Entry_Id = ve.Visitor_Entry_Id AND ve.Visitor_Type_Id = VisitorTypeId
		WHERE
			ve.Visitor_Entry_Id = VisitorEntryId;

			select 
			Visitor_Entry_Detail_Id VisitorEntryDetailId,
			Visitor_Entry_Id VisitorEntryId,
			Title_id Titleid,
			First_Name FirstName,
			Last_Name LastName,
			Department_Id DepartmentId,
			Dob,
			Mail_Id MailId,
			Mobile_No MobileNo,
            Aadhar_No AadharNo,
            Tag_No TagNo,
            Visitor_Company VisitorCompany,
			Id_Card_Type IdCardType,
			Id_Card_No IdCardNo,
			Document_Name DocumentName,
			SchemeDetail,
            Document_Name DocumentUrl,
			   Digital_Sign_Name AS DigitalSignName,
            Digital_Sign_URL AS DigitalSignURL,
            Signed_Version AS SignedVersion,
            Is_Terms_Agreed AS IsTermsAgreed,
			Status
			from Visitor_Entry_Detail where Visitor_Entry_Id=VisitorEntryId;
			select * from Visitor_Entry_Belonging_Detail where Visitor_Entry_Id=VisitorEntryId;
			select * from Visitor_Entry_Material_Detail where Visitor_Entry_Id=VisitorEntryId;
			select * from Visitor_Entry_Atv_Detail where Visitor_Entry_Id=VisitorEntryId;
		end if;
	end if;
    
	if type='OnChangePartyType'
	then
  
		select*from(
		select s.Supplier_Id RefId,
			s.Supplier_Name RefName,
            63 PartyType 
            from Supplier s where s.Status=1
		union all
		select 
			s.Customer_Id RefId,
            s.Customer_Name RefName,
            62 PartyType 
            from Customer s where s.Status=1
		)A where a.PartyType=PartyType
		order by RefName asc ;
	end if;
    
	if type='OnChangeVisitorType'
	then
		select
		v.Visitor_Id VisitorId,
        vd.Visitor_Detail_Id VisitorDetailId,
		-- v.Visitor_Code VisitorCode,
        vd.visitor_detail_Code VisitorCode,
        vd.visitor_detail_Code VisitorDetailCode,
		v.Visitor_Type_Id VisitorTypeId,
		v.Company_Id CompanyId,
		v.Plant_Id PlantId,
		v.Country_Id CountryId,
		v.State_Id StateId,
		v.City_Id CityId,
		v.Title_id Titleid,
		-- concat(m.Meta_Sub_Description,'. ',v.First_Name,' ',v.Last_Name) FirstName,
		concat(vd.First_Name,' ',vd.Last_Name) FirstName,
		vd.Last_Name LastName,
		v.Dob,
		v.Visitor_Company VisitorCompany,
		v.Address,
		vd.Mail_Id MailId,
		vd.Mobile_No MobileNo ,
        -- vd.Aadhar_No AadharNo,
        vd.Tag_No TagNo,
        vd.Visitor_Company VisitorCompany,
		v.Id_Card_Type IdCardType,
		v.Id_Card_No IdCardNo,
		v.Document_Name DocumentName,
		v.Document_Url DocumentUrl,
		    vd.Digital_Sign_Name AS DigitalSignName,
        vd.Digital_Sign_URL AS DigitalSignURL,
        vd.Signed_Version AS SignedVersion,
        vd.Is_Terms_Agreed AS IsTermsAgreed,
		v.Status,
		v.Created_By CreatedBy,
		v.Created_On CreatedOn, 
		v.Modified_By ModifiedBy,
		v.Modified_On ModifiedOn
		from Visitor v 
		inner join Metadata m on m.Meta_Sub_Id=Title_id
        INNER JOIN 
			visitor_detail vd ON v.Visitor_Id = vd.Visitor_Id
		where v.Visitor_Type_Id=VisitorTypeId and
		(
		RoleId = 2 OR
		RoleId <> 2 and v.Status = 1 
		) and v.Company_Id = CompanyId and v.Plant_Id = PlantId
		order by ifnull(v.Created_On, v.Modified_On) desc
        LIMIT 20;

		-- select concat(Vehicle_Name,' ( ',Vehicle_No,' ) ') VehicleNameAndNo,
-- 		Vehicle_Name VehicleName,
-- 		Vehicle_No VehicleNo from Vehicle where Status=1;
		select
		v.Visitor_Entry_Id VisitorEntryId,
		v.Visitor_Entry_Code VisitorEntryCode,
		v.Visitor_Entry_Date VisitorEntryDate,
		v.Company_Id CompanyId,
		v.Plant_Id PlantId,
		v.Gate_Id GateId,
		v.Visitor_Type_Id VisitorTypeId,
		m.Meta_Sub_Description VisitorTypeName,
		v.Visitor_Id VisitorId,
		-- v.Person_Name PersonName,
		vd.First_Name PersonName,
		v.Mobile_No MobileNo,
		v.Id_Proof_Type IdProofType,
		v.Id_Proof_No IdProofNo,
		v.Visited_Employee_Id VisitedEmployeeId,
		concat(vd.First_Name , ' ' ,vd.Last_Name) PersonToVisit,
		v.Valid_From ValidFrom,
		v.Valid_To ValidTo,
		v.Access_Type AccessType,
		v.Is_Extended IsExtended,
		v.Status Status,
		m3.Meta_Sub_Description StatusName,
		u.User_Name CreatedbyName,
		CONVERT(v.Created_On, CHAR(19) ) CreatedOn,
		ifnull(CONVERT(v.Modified_On  , CHAR(19) ),
		CONVERT(v.Created_On , CHAR(19) )) ModifiedOn,
		ifnull(u.User_Name,u1.User_Name) ModifiedByName,
		v.Modified_By ModifiedBy,
		v.Is_Appointment_booking IsAppointmentBooking,
		v.Is_Pre_Booking IsPreBooking,
		v.Visitor_Image_Name,
		concat(Scheme,v.Visitor_Image_Name) VisitorImageUrl,
        CASE
		WHEN vl.Checked_In IS NOT NULL AND vl.Checked_Out IS NULL THEN 0
		ELSE 1
		END AS CheckOut,
		vd.Visitor_Entry_Detail_Id VisitorEntryDetailId,
		v.Purpose_Of_Visit PurposeOfVisit,
		m4.Meta_Sub_Description PurposeOfVisitName,
        v.Vehicle_No VehicleNo,
        v.Vehicle_Model VehicleModel,
        v.Vehicle_Type_Id VehicleTypeId,
        v.Entry_Type EntryType,
        v.Entry_Time EntryTime,
        v.Exit_Time ExitTime,
        m1.Meta_Sub_Description VehicleTypeName,
        v.Vehicle_Name VehicleName,
        v.Driver_Id DriverId,
        v.Driver_Name DriverName
		from Visitor_Entry v 
		inner join Metadata m on m.Meta_Sub_Id=v.Visitor_Type_Id
		inner join Metadata m3 on m3.Meta_Sub_Id=v.Status
		inner join Metadata m4 on m4.Meta_Sub_Id=v.Purpose_Of_Visit
        left join metadata m1 on m1.Meta_Sub_iD = V.Vehicle_Type_Id
		inner join Users u on u.User_Id=v.Created_By
		left join Users u1 on u1.User_Id=v.Modified_By
        left join Users ud1 on ud1.User_Id=v.Driver_Id
		left join Visitor_Entry_Log vl on vl.Visitor_Entry_Code=v.Visitor_Entry_Code  -- and v.Visitor_Type_Id=35
		left join Visitor_Entry_Detail vd on vd.Visitor_Entry_Id=v.Visitor_Entry_Id -- and v.Visitor_Type_Id=35 
        -- and v.Is_Appointment_Booking = 1 -- and (v.Is_Internal_Appointment = 0 AND v.Is_Internal_Appointment IS NOT NULL)
		where v.Company_Id = CompanyId  and v.Plant_Id  = PlantId  and
		 v.Visitor_Type_Id=66 and (v.Status = 75 or v.Status = 1)
         -- and curdate() between date(vd.Valid_From) and COALESCE(DATE(vd.Valid_To), date(vd.Valid_From))
		order by ifnull(v.Modified_On,v.Created_On) desc;

		select 
		wp.Company_Id CompanyId,
		wp.Plant_Id PlantId,
		wp.Gate_Id GateId,
		wp.Work_Permit_Id WorkPermitId,
		wp.Work_Permit_Code WorkPermitCode,
		CONVERT(wp.Work_Permit_Date, CHAR(19)) WorkPermitDate,
		CONVERT(wp.Valid_From, CHAR(19))  ValidFrom,
		CONVERT(wp.Valid_To, CHAR(19))  ValidTo,
		wp.Contract_Name ContractName,
		wp.Work_Organizer WorkOrganizer,
		wp.Po_No PoNo,
		wp.Status_Remarks StatusRemarks,
		wp.Status Status,
		m.Meta_Sub_Description StatusName,
		wp.Created_By CreatedBy,
		wp.Created_On CreatedOn,
		wp.Modified_By ModifiedBy,
		wp.Modified_On ModifiedOn
		from
		Work_Permit wp
		inner join Metadata m on m.Meta_Sub_Id = wp.Status and wp.Status = 75
		-- inner join Approval a on a.Document_No = wp.Work_Permit_Code
		-- inner join Approval_Detail ad on ad.Approval_Id = a.Approval_Id
		order by WorkPermitDate desc;
	
	end if;
    
	if type='OnChangeVisitor'
	then
    
		if VisitorTypeId=36 or VisitorTypeId=35
		then
			select
			v.Visitor_Id VisitorId,
            v.Visitor_Detail_Id VisitorDetailId,
            v.visitor_detail_code VisitorDetailCode,
			v.Title_Id TitleId,
			v.First_Name FirstName,
			v.Last_Name LastName,
			v.Department_Id DepartmentId,
			v.Dob Dob,
			v.Mail_Id MailId,
			v.Mobile_No MobileNo,
           --  v.Aadhar_No AadharNo,
            v.Tag_No TagNo,
			v.Visitor_Company VisitorCompany,
			v.Id_Card_Type IdCardType,
			v.Id_Card_No IdCardNo,
			v.Document_Name DocumentName,
			concat(Scheme,v.Document_Name) DocumentUrl,
			            v.Digital_Sign_Name AS DigitalSignName,
            v.Digital_Sign_URL AS DigitalSignURL,
            v.Signed_Version AS SignedVersion,
            v.Is_Terms_Agreed AS IsTermsAgreed,
			v.Status Status,
			concat(m.Meta_Sub_Description,'. ',v.First_Name,' ',v.Last_Name) VisitorName,
			m1.Meta_Sub_Description StatusName,
			-- m2.Meta_Sub_Description IdCardTypeName,
			-- d.Department_Name DepartMentName,
			0 VisitorEntryDetailId,
			0 VisitorEntryId
			from Visitor_Detail v 
			inner join Metadata m on m.Meta_Sub_Id=v.Title_id
			inner join Metadata m1 on m1.Meta_Sub_Id=v.Status
			-- inner join Metadata m2 with(nolock) on m2.Meta_Sub_Id=v.Id_Card_Type
			-- LEFT join Department d with(nolock) on d.Department_Id=v.Department_Id
			-- where v.Visitor_Id=VisitorId and v.Status=1;
            where v.Visitor_Detail_Id=VisitorId and v.Status=1;
		end if;
	end if;
    if type='OnChangeMultiVisitor'
	then
		if VisitorTypeId=36 or VisitorTypeId=35
		then
			select
			v.Visitor_Id VisitorId,
            v.Visitor_Detail_Id VisitorDetailId,
            v.visitor_detail_Code VisitorDetailCode,
			v.Title_Id TitleId,
			v.First_Name FirstName,
			v.Last_Name LastName,
			v.Department_Id DepartmentId,
			v.Dob Dob,
			v.Mail_Id MailId,
			v.Mobile_No MobileNo,
          --   v.Aadhar_No AadharNo,
            v.Tag_No TagNo,
			v.Visitor_Company VisitorCompany,
			v.Id_Card_Type IdCardType,
			v.Id_Card_No IdCardNo,
			v.Document_Name DocumentName,
			concat(Scheme,v.Document_Name) DocumentUrl,
			   v.Digital_Sign_Name AS DigitalSignName,
            v.Digital_Sign_URL AS DigitalSignURL,
            v.Signed_Version AS SignedVersion,
            v.Is_Terms_Agreed AS IsTermsAgreed,
			v.Status Status,
			concat(m.Meta_Sub_Description,'. ',v.First_Name,' ',v.Last_Name) VisitorName,
			m1.Meta_Sub_Description StatusName,
			-- m2.Meta_Sub_Description IdCardTypeName,
			-- d.Department_Name DepartMentName,
			0 VisitorEntryDetailId,
			0 VisitorEntryId
			from Visitor_Detail v 
			inner join Metadata m on m.Meta_Sub_Id=v.Title_id
			inner join Metadata m1 on m1.Meta_Sub_Id=v.Status
			-- inner join Metadata m2 with(nolock) on m2.Meta_Sub_Id=v.Id_Card_Type
			-- LEFT join Department d with(nolock) on d.Department_Id=v.Department_Id
			 where v.Visitor_Id=VisitorId and FIND_IN_SET (v.Visitor_Detail_Id, VisitorDetailIds) and v.Status=1;
           -- where v.Visitor_Detail_Id=VisitorDetailId and v.Status=1;

		end if;
	end if;
	IF type = 'FilterPreBookinNo' THEN
		SELECT *
		FROM Visitor_Entry v
		WHERE v.Visitor_Entry_Code LIKE CONCAT('%',text, '%')
			-- AND v.Checkin_Status IS NULL
		LIMIT 15;
	END IF;

	if type='SearchInitialize'
	then
		select 
		v.Visitor_Entry_Id VisitorEntryId,
		v.Visitor_Entry_Code VisitorEntryCode,
		v.Visitor_Entry_Date VisitorEntryDate,
		v.Company_Id CompanyId,
		v.Plant_Id PlantId,
		v.Gate_Id GateId,
		v.Visitor_Type_Id VisitorTypeId,
		m.Meta_Sub_Description VisitorTypeName,
		v.Visitor_Id VisitorId,
		-- v.Person_Name PersonName,
		vd.First_Name PersonName,
		v.Mobile_No MobileNo,
        -- vd.Aadhar_No AadharNo,
		v.Id_Proof_Type IdProofType,
		v.Id_Proof_No IdProofNo,
		v.Visited_Employee_Id VisitedEmployeeId,
		concat(vd.First_Name , ' ' ,vd.Last_Name) PersonToVisit,
		v.Valid_From ValidFrom,
		v.Valid_To ValidTo,
		v.Access_Type AccessType,
		v.Is_Extended IsExtended,
		v.Status Status,
		m3.Meta_Sub_Description StatusName,
		u.User_Name CreatedbyName,
		CONVERT(v.Created_On, CHAR(19) ) CreatedOn,
		ifnull(CONVERT(v.Modified_On  , CHAR(19) ),
		CONVERT(v.Created_On , CHAR(19) )) ModifiedOn,
		ifnull(u.User_Name,u1.User_Name) ModifiedByName,
		v.Modified_By ModifiedBy,
		v.Is_Appointment_booking IsAppointmentBooking,
		v.Is_Pre_Booking IsPreBooking,
		v.Visitor_Image_Name,
		concat(Scheme,v.Visitor_Image_Name) VisitorImageUrl,
		        vd.Digital_Sign_Name AS DigitalSignName,
        vd.Digital_Sign_URL AS DigitalSignURL,
		vd.Signed_Version AS SignedVersion,
        vd.Is_Terms_Agreed AS IsTermsAgreed,
        CASE
		WHEN vl.Checked_In IS NOT NULL AND vl.Checked_Out IS NULL THEN 0
		ELSE 1
		END AS CheckOut,
		vd.Visitor_Entry_Detail_Id VisitorEntryDetailId,
		v.Purpose_Of_Visit PurposeOfVisit,
		m4.Meta_Sub_Description PurposeOfVisitName,
		(
            SELECT GROUP_CONCAT(DISTINCT m.Area_Name SEPARATOR ', ') AS AreaToVisitName
			FROM Visitor_Entry_Atv_Detail B
			INNER JOIN Area m ON m.Area_Id = b.Area_To_Visit
			WHERE b.Visitor_Entry_Id = v.Visitor_Entry_Id
		) AS AreaToVisitName,
        v.Vehicle_No VehicleNo,
        v.Vehicle_Name VehicleName,
        v.Driver_Id DriverId,
		v.Modified_On, 
		v.Created_On
		from Visitor_Entry v 
		inner join Metadata m on m.Meta_Sub_Id=v.Visitor_Type_Id
		inner join Metadata m3 on m3.Meta_Sub_Id=v.Status
		inner join Metadata m4 on m4.Meta_Sub_Id=v.Purpose_Of_Visit
		inner join Users u on u.User_Id=v.Created_By
		left join Users u1 on u1.User_Id=v.Modified_By
		left join Visitor_Entry_Detail vd on vd.Visitor_Entry_Id=v.Visitor_Entry_Id -- and v.Visitor_Type_Id=35 
        left join Visitor_Entry_Log vl on vl.Visitor_Entry_Code=v.Visitor_Entry_Code and vd.Visitor_Entry_Detail_Id = vl.Visitor_Entry_Detail_Id  -- and v.Visitor_Type_Id=35
        -- and v.Is_Appointment_Booking = 1 -- and (v.Is_Internal_Appointment = 0 AND v.Is_Internal_Appointment IS NOT NULL)
		where v.Company_Id = CompanyId and v.Plant_Id  = PlantId and
		 (v.Visitor_Type_Id=35 or v.Visitor_Type_Id = 36) and v.Status = 75 
         -- and curdate() between date(vd.Valid_From) and COALESCE(DATE(vd.Valid_To), date(vd.Valid_From))
		order by ifnull(v.Modified_On,v.Created_On) desc;
	end if;
	if type='CheckinCkeckoutPageLoad'
	then
		select * from Metadata where Meta_Type_Code='CHK';
		(select 
		v.Visitor_Entry_Log_Id VisitorEntryLogId,
		v.Visitor_Entry_Detail_Id VisitorEntryDetailId,
		v.Visitor_Entry_Code VisitorEntryCode,
		m1.Meta_Sub_Description VisitorTypeName,
		concat(vd.First_Name,' ',vd.Last_Name) VisitorName,
		concat(usr.User_Name,' ') PersonToVisit,
		CONVERT(v.Checked_In, CHAR(19) ) CheckedIn,
		CONVERT(v.Checked_Out, CHAR(19) ) CheckedOut,
		v.Created_By CreatedBy,
		u.User_Name CreatedByName,
		v.Created_On CreatedOn,
		v.Modified_By ModifiedBy,
		ifnull(u1.User_Name,'') ModifiedByName,
		v.Modified_On ModifiedOn
		from Visitor_Entry_Log v 
		inner join Visitor_Entry_Detail vd on vd.Visitor_Entry_Detail_Id=v.Visitor_Entry_Detail_Id
		inner join Visitor_Entry ve on ve.Visitor_Entry_Id = vd.Visitor_Entry_Id and v.Visitor_Entry_Code=ve.Visitor_Entry_Code
		-- inner join Employee e on ve.Visited_Employee_Id = e.Employee_Id 
		inner join Users usr on usr.User_Id = ve.Visited_Employee_Id
		-- inner join Metadata m on m.Meta_Sub_Id=vd.Title_id
		inner join Metadata m1 on m1.Meta_Sub_Id=ve.Visitor_Type_Id
		inner join Users u on u.User_Id=v.Created_By
		left join Users u1 on u1.User_Id=v.Modified_By
        where 
        ve.Company_Id = CompanyId
		and ve.Plant_Id = PlantId)
        UNION
        (select 
		v.Visitor_Entry_Log_Id VisitorEntryLogId,
		v.Visitor_Entry_Detail_Id VisitorEntryDetailId,
		v.Visitor_Entry_Code VisitorEntryCode,
		'Work Permit' VisitorTypeName,
		wpd.Worker_Name VisitorName,
		concat(usr.User_Name,' ') PersonToVisit,
		CONVERT(v.Checked_In, CHAR(19) ) CheckedIn,
		CONVERT(v.Checked_Out, CHAR(19) ) CheckedOut,
		v.Created_By CreatedBy,
		u.User_Name CreatedByName,
		v.Created_On CreatedOn,
		v.Modified_By ModifiedBy,
		ifnull(u1.User_Name,'') ModifiedByName,
		v.Modified_On ModifiedOn
		from Visitor_Entry_Log v 
		inner join wp_worker_detail wpd on wpd.WP_Worker_Detail_Id=v.Visitor_Entry_Detail_Id
		inner join work_permit wp on wp.Work_Permit_Id = wpd.Work_Permit_Id
		-- inner join Employee e on ve.Visited_Employee_Id = e.Employee_Id 
		inner join Users usr on usr.User_Id = wp.Work_Organizer
		-- inner join Metadata m on m.Meta_Sub_Id=vd.Title_id
		-- inner join Metadata m1 on m1.Meta_Sub_Id=ve.Visitor_Type_Id
		inner join Users u on u.User_Id=v.Created_By
		left join Users u1 on u1.User_Id=v.Modified_By
        where 
        wp.Company_Id = CompanyId
		and wp.Plant_Id = PlantId
        and v.Visitor_Entry_Code like '%WOP%')
		order by ifnull(ModifiedOn,CreatedOn) desc;
	end if;
	if type='FilterVisitorEntryCodeManual'
        then
                if EntryType=60
                then
                         (select 
                        Visitor_Entry_Code VisitorEntryCode,
                        Created_On CreatedOn,
                        Modified_On ModifiedOn
                        from Visitor_Entry ve 
                        inner join Visitor_Entry_Detail vd on vd.Visitor_Entry_Id=ve.Visitor_Entry_Id
                        where 
                        Visitor_Entry_Code 
                        LIKE CONCAT('%', text, '%')
                        and ve.Status=75 and
                        CURDATE() BETWEEN DATE(vd.Valid_From) AND DATE(vd.Valid_To) and 
                        ve.Plant_Id = PlantId and
                        not exists(
                                select 1 from Visitor_Entry_Log v  
                                where v.Visitor_Entry_Code=ve.Visitor_Entry_Code and v.Visitor_Entry_Detail_Id=vd.Visitor_Entry_Detail_Id 
                                and Checked_In is not null 
                                and date(Created_On )= curdate()
                        )
                        group by Visitor_Entry_Code,Created_On,Modified_On)
                        
                        UNION
							(SELECT
							wp.Work_Permit_Code AS VisitorEntryCode,
							Created_On AS CreatedOn,
							Modified_On AS ModifiedOn
						FROM
							Work_Permit wp
							INNER JOIN Wp_Worker_Detail wd ON wd.Work_Permit_Id = wp.Work_Permit_Id and wd.Is_Working = 1
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
							Work_Permit_Code,Created_On,Modified_On)
						ORDER BY
							CreatedOn DESC, ModifiedOn DESC
						LIMIT 10;

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
                -- end if;
                else 
                       (select DISTINCT
                        ve.Visitor_Entry_Code AS VisitorEntryCode,
						ve.Created_On AS CreatedOn,
						ve.Modified_On AS ModifiedOn
                        from Visitor_Entry ve 
                        inner join Visitor_Entry_Detail vd on vd.Visitor_Entry_Id=ve.Visitor_Entry_Id
                        where 
                        Visitor_Entry_Code like concat('%',text,'%') and ve.Status=75 and
                        -- curdate() between date(vd.Valid_From )and date(vd.Valid_To) and 
                        ve.Plant_Id = PlantId  and
                        exists(
                                select 1 from Visitor_Entry_Log v 
                                where v.Visitor_Entry_Code=ve.Visitor_Entry_Code and v.Visitor_Entry_Detail_Id=vd.Visitor_Entry_Detail_Id 
                                and Checked_In is not null and Checked_Out is null 
                                -- and date(Created_On)= curdate()
                        ))
                        UNION
                        (select DISTINCT
                        Work_Permit_Code WorkPermitCode,
                        Created_On AS CreatedOn,
						Modified_On AS ModifiedOn
                        from Work_Permit wp 
                        inner join Wp_Worker_Detail wd on wd.Work_Permit_Id=wp.Work_Permit_Id
                        where 
                        Work_Permit_Code like concat('%',text,'%') and wp.Status=75 and
                        -- curdate() BETWEEN date(wd.Valid_From) AND COALESCE(date(wd.Valid_To), curdate())
						wp.Plant_Id = PlantId  and
                        exists(
                                select 1 from Visitor_Entry_Log v 
                                where v.Visitor_Entry_Code=wp.Work_Permit_Code and v.Visitor_Entry_Detail_Id=wd.Wp_Worker_Detail_Id and 
                                Checked_In is not null and Checked_Out is null 
                                -- and date(Created_On) = curdate()
                        ))
                        order by CreatedOn,ModifiedOn desc
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
	if type='FilterVisitorEntryCode'
	then
		if EntryType=60
		then
			-- Check In
			SELECT
				ve.Visitor_Entry_Code AS VisitorEntryCode,
				vd.Visitor_Entry_Detail_Id AS VisitorEntryDetailId,
				ve.Person_Name AS PersonName
			FROM
				Visitor_Entry ve
				INNER JOIN Visitor_Entry_Detail vd ON vd.Visitor_Entry_Id = ve.Visitor_Entry_Id
			WHERE
				Visitor_Entry_Code LIKE CONCAT('%',text, '%')
				AND ve.Status = 75
				AND CURDATE() BETWEEN DATE(vd.Valid_From) AND COALESCE(DATE(vd.Valid_To), CURDATE())
				AND ve.Plant_Id = PlantId
				AND NOT EXISTS (
					SELECT 1
					FROM Visitor_Entry_Log v
					WHERE v.Visitor_Entry_Code = ve.Visitor_Entry_Code
						AND v.Visitor_Entry_Detail_Id = vd.Visitor_Entry_Detail_Id
						AND Checked_In IS NOT NULL
						AND DATE(Created_On) = CURDATE()
				)
			GROUP BY
				Visitor_Entry_Code, vd.Visitor_Entry_Detail_Id, ve.Person_Name
			ORDER BY
				Created_On DESC, Modified_On DESC
			LIMIT 10;

			-- Check Out -- 5 min Less
			select 
			Visitor_Entry_Code VisitorEntryCode,
			vd.Visitor_Entry_Detail_Id VisitorEntryDetailId,
			ve.Person_Name PersonName
			from Visitor_Entry ve 
			inner join Visitor_Entry_Detail vd on vd.Visitor_Entry_Id=ve.Visitor_Entry_Id
			where 
			Visitor_Entry_Code like concat('%',text,'%') and ve.Status=75 and
			curdate() BETWEEN date(vd.Valid_From) AND COALESCE (date(vd.Valid_To), curdate())
			and ve.Plant_Id = PlantId  and
			exists(
				select 1 from Visitor_Entry_Log v 
				where v.Visitor_Entry_Code=ve.Visitor_Entry_Code and v.Visitor_Entry_Detail_Id=vd.Visitor_Entry_Detail_Id and 
				Checked_In is not null and Checked_Out is null and date(Created_On)= curdate()
				AND TIMESTAMPDIFF(SECOND, Checked_In, NOW()) <= 10
			)
			order by Created_On,Modified_On desc
            limit 10;

			-- Check Out -- 5 min More
			select 
			Visitor_Entry_Code VisitorEntryCode,
			vd.Visitor_Entry_Detail_Id VisitorEntryDetailId,
			ve.Person_Name PersonName
			from Visitor_Entry ve 
			inner join Visitor_Entry_Detail vd on vd.Visitor_Entry_Id=ve.Visitor_Entry_Id
			where 
			Visitor_Entry_Code like concat('%',text,'%') and ve.Status=75 and
			curdate() BETWEEN date(vd.Valid_From) AND COALESCE(date(vd.Valid_To), curdate())
			and ve.Plant_Id = PlantId  and
			exists(
				select 1 from Visitor_Entry_Log v 
				where v.Visitor_Entry_Code=ve.Visitor_Entry_Code and v.Visitor_Entry_Detail_Id=vd.Visitor_Entry_Detail_Id and 
				Checked_In is not null and Checked_Out is null and date(Created_On)= curdate()
				AND TIMESTAMPDIFF(SECOND, Checked_In, NOW()) >= 10
			)
			order by Created_On,Modified_On desc
            limit 10;

			-- Check In/ Out
			select
			Visitor_Entry_Code VisitorEntryCode,
			vd.Visitor_Entry_Detail_Id VisitorEntryDetailId,
			ve.Person_Name PersonName
			from Visitor_Entry ve 
			inner join Visitor_Entry_Detail vd on vd.Visitor_Entry_Id=ve.Visitor_Entry_Id
			where 
			Visitor_Entry_Code like concat('%',text,'%') and ve.Status=75 and
			curdate() BETWEEN date(vd.Valid_From) AND COALESCE(date(vd.Valid_To), curdate())
			and ve.Plant_Id = PlantId  and
			exists(
				select 1 from Visitor_Entry_Log v 
				where v.Visitor_Entry_Code=ve.Visitor_Entry_Code and v.Visitor_Entry_Detail_Id=vd.Visitor_Entry_Detail_Id and 
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
		-- end if;
		else 
			select 
			Visitor_Entry_Code VisitorEntryCode,
			vd.Visitor_Entry_Detail_Id VisitorEntryDetailId
			from Visitor_Entry ve 
			inner join Visitor_Entry_Detail vd on vd.Visitor_Entry_Id=ve.Visitor_Entry_Id
			where 
			Visitor_Entry_Code like concat('%',text,'%') and ve.Status=75 and
			curdate() BETWEEN date(vd.Valid_From) AND COALESCE(date(vd.Valid_To), curdate())
			and 
			ve.Plant_Id = PlantId and
			not exists(
				select 1 from Visitor_Entry_Log v  
				where v.Visitor_Entry_Code=ve.Visitor_Entry_Code and v.Visitor_Entry_Detail_Id=vd.Visitor_Entry_Detail_Id and 
				Checked_In is not null and date(Created_On)= curdate()
			)
			group by Visitor_Entry_Code,vd.Visitor_Entry_Detail_Id,Created_On,Modified_On
			order by Created_On,Modified_On desc
            limit 10;

			select 
			Visitor_Entry_Code VisitorEntryCode,
			vd.Visitor_Entry_Detail_Id VisitorEntryDetailId
			from Visitor_Entry ve 
			inner join Visitor_Entry_Detail vd on vd.Visitor_Entry_Id=ve.Visitor_Entry_Id
			where 
			Visitor_Entry_Code like concat('%',text,'%') and ve.Status=75 and
			curdate() BETWEEN date(vd.Valid_From) AND COALESCE(date(vd.Valid_To), curdate())
			and ve.Plant_Id = PlantId  and
			exists(
				select 1 from Visitor_Entry_Log v 
				where v.Visitor_Entry_Code=ve.Visitor_Entry_Code and v.Visitor_Entry_Detail_Id=vd.Visitor_Entry_Detail_Id and 
				Checked_In is not null and Checked_Out is null and date(Created_On)= curdate()
			)
			order by Created_On,Modified_On, VisitorEntryDetailId desc
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
	if type='OnChangeVisitorEntryCode'
	then
		set Visitor_Type_Id=(select Visitor_Type_Id from Visitor_Entry where Visitor_Entry_Code=VisitorEntryCode);
		set VisitorEntryId=(select Visitor_Entry_Id from Visitor_Entry where Visitor_Entry_Code=VisitorEntryCode);
        set WorkPermitId=(select Work_Permit_Id from Work_Permit where Work_Permit_Code=VisitorEntryCode);
		
		if EntryType=60
		then
			if VisitorEntryId is not null then
				select 
				vd.Visitor_Entry_Detail_Id VisitorEntryDetailId,
				CONCAT(vd.First_Name,' ',vd.Last_Name) VisitorEmpName,
				vd.Valid_To ValidTo
				from Visitor_Entry_Detail vd
				where Visitor_Entry_Id=VisitorEntryId and Status=1
				and not exists(
					select 1 from Visitor_Entry_Log v  
					where v.Visitor_Entry_Code=VisitorEntryCode and
					v.Visitor_Entry_Detail_Id=vd.Visitor_Entry_Detail_Id and Checked_In is not null 
				)
				group by 
				vd.Visitor_Entry_Detail_Id,
				vd.First_Name, vd.Last_Name;
			ELSE
				
					select 
					wpd.WP_Worker_Detail_Id VisitorEntryDetailId,
					wpd.Worker_Name VisitorEmpName,
					wpd.Valid_To ValidTo
					from wp_worker_detail wpd
					where wpd.Work_Permit_Id=WorkPermitId and Status=1
					and not exists(
						select 1 from Visitor_Entry_Log v  
						where v.Visitor_Entry_Code=VisitorEntryCode and
						v.Visitor_Entry_Detail_Id=wpd.WP_Worker_Detail_Id  and Checked_In is not null 
						and date(v.Checked_In) = curdate()
					)
					group by 
					wpd.WP_Worker_Detail_Id,
					wpd.Worker_Name;
            end if;
		-- end if;
		else
			
			if VisitorEntryId is not null then
				select 
				vd.Visitor_Entry_Detail_Id VisitorEntryDetailId,
				CONCAT(vd.First_Name,' ',vd.Last_Name) VisitorEmpName,
				vd.Valid_To ValidTo
				from Visitor_Entry_Detail vd where Visitor_Entry_Id=VisitorEntryId and Status=1
				and exists(
					select 1 from Visitor_Entry_Log v 
					where v.Visitor_Entry_Code=VisitorEntryCode and
					v.Visitor_Entry_Detail_Id=vd.Visitor_Entry_Detail_Id and Checked_In is not null and Checked_Out is null 
					-- and date(Created_On)=curdate()
				)
				group by 
				vd.Visitor_Entry_Detail_Id,
				vd.First_Name, vd.Last_Name;
            ELSE 
				
				select 
				wpd.WP_Worker_Detail_Id VisitorEntryDetailId,
				wpd.Worker_Name VisitorEmpName,
				wpd.Valid_To ValidTo
				from wp_worker_detail wpd
				where wpd.Work_Permit_Id=WorkPermitId and Status=1
				and exists(
					select 1 from Visitor_Entry_Log v  
					where v.Visitor_Entry_Code=VisitorEntryCode and
					v.Visitor_Entry_Detail_Id=wpd.WP_Worker_Detail_Id and v.Checked_In is not null and v.Checked_Out is null 
				   -- and date(v.Created_On)= curdate()
				)
				group by 
				wpd.WP_Worker_Detail_Id,
				wpd.Worker_Name;
			END IF;
		end if;
	end if;
	if type='SendPass' or type='ShowPass'    
	 then
		  select     
		  ve.Company_Id CompanyId,    
		  ve.Plant_Id PlantId,  
		  p.Plant_Name PlantName,  
          vd.Tag_No TagNo,
		  vd.Visitor_Company VisitorCompany,  
		  ve.Gate_Id GateId,    
          0 as RoleId,
		  ve.Visitor_Entry_Id VisitorEntryId,    
		  ve.Visitor_Entry_Code VisitorEntryCodeHeader,    
		  vd.Visitor_Entry_Detail_Code VisitorEntryCode,    
		  ve.Visitor_Entry_Date VisitorEntryDate,    
		  ve.Visitor_Type_Id VisitorTypeId,    
		  m.Meta_Sub_Description VisitorTypeName,    
		  ve.Visitor_Id VisitorId,    
		  vd.First_Name PersonName,    
		  vd.Mobile_No MobileNo,    
		  ve.Id_Proof_Type IdProofType,    
		  ve.Id_Proof_No IdProofNo,    
		  ve.Visited_Employee_Id VisitedEmployeeId,    
		  concat(vd.First_Name, ' ' ,vd.Last_Name, '') PersonToVisit,    
		  vd.Valid_From ValidFrom,    
		  vd.Valid_To ValidTo,    
		  ve.Access_Type AccessType,    
		  ve.Is_Extended IsExtended,    
		  ve.Is_Appointment_Booking IsAppointmentBooking,    
		  ve.Is_Pre_Booking IsPreBooking,    
		  ve.Visitor_Remarks VisitorRemarks,    
		  ve.Purpose_Of_Visit PurposeOfVisit,    
		  m4.Meta_Sub_Description PurposeOfVisitName,    
		  -- ve.Visitor_Image_Name VisitorImageName,    
		  vd.Document_Name VisitorImageName,    
		  concat(Scheme,vd.Document_URL) VisitorImageUrl,    
		  -- concat(Scheme,vd.Document_Url) VisitorImageUrl,
		  (
            SELECT GROUP_CONCAT(DISTINCT m.Area_Name SEPARATOR ', ') AS AreaToVisitName
			FROM Visitor_Entry_Atv_Detail B
			INNER JOIN Area m ON m.Area_Id = b.Area_To_Visit
			WHERE B.Visitor_Entry_Id = ve.Visitor_Entry_Id
		) AS AreaToVisitName,
            -- (SELECT GROUP_CONCAT(DISTINCT CONCAT(bd.Device_Name, ' - ', 
-- 				case when bd.Device_No = '' then '0'else bd.Device_No end
--             ) ORDER BY bd.Device_Name SEPARATOR ', ')
				(SELECT GROUP_CONCAT(
               DISTINCT CONCAT(
                   bd.Device_Name, 
                   CASE 
                       WHEN bd.Device_Name = '' THEN '' 
                       ELSE CONCAT(' - ', CASE WHEN bd.Device_No = '' THEN '0' ELSE bd.Device_No END)
                   END
               ) 
               ORDER BY bd.Device_Name SEPARATOR ', '
           ) AS Device_Name
    FROM Visitor_Entry_Belonging_Detail bd 
    WHERE bd.Visitor_Entry_Id = ve.Visitor_Entry_Id
) AS BelongingDetails,
		  -- (SELECT GROUP_CONCAT(DISTINCT CONCAT(bd.Device_Name, ' - ', bd.Device_No) SEPARATOR ', ')
-- 		   FROM Visitor_Entry_Belonging_Detail bd
-- 		   WHERE bd.Visitor_Entry_Id = ve.Visitor_Entry_Id
-- 		   GROUP BY bd.Device_Name, bd.Device_No) AS BelongingDetails,
		  ve.Dc_Number DcNumber,    
		  ve.Party_Type PartyType,    
		  ve.Party_Name PartyName,    
		  ve.Invoice_Number InvoiceNumber,    
		  ve.Po_Number PoNumber,    
		  ve.Container_Number ContainerNumber,    
		  ve.Is_Existing_Vehicle IsExistingVehicle,    
		  ve.Vehicle_Name VehicleName,    
		  ve.Vehicle_No VehicleNo,    
		  ve.Number_Of_Passengers NumberOfPassengers,    
		  ve.Is_Existing_Driver IsExistingDriver,    
		  ve.Driver_Id DriverId,    
		  ve.Vehicle_Document_Name VehicleDocumentName,    
		  concat(SchemeVehicle,Vehicle_Document_Name) VehicleDocumentUrl,    
		  ve.Route_Id RouteId,    
		  ve.Starting_Km StartingKm,    
		  ve.Ending_Km EndingKm,     
		  ve.Status Status,    
		  ve.Created_By CreatedBy,    
		  ve.Created_On CreatedOn,    
		  ve.Modified_By ModifiedBy,    
		  ve.Modified_On Modified_On,  
		  u.User_Name UserName,
		  v.Visitor_Code VisitorCode,
		  vd.Visitor_Entry_Detail_Id VisitorEntryDetailId,
		  r.Role_Name RoleName,
		  vd.Digital_Sign_Name AS DigitalSignName,
          vd.Digital_Sign_URL AS DigitalSignURL,
		  vd.Signed_Version AS SignedVersion,
          vd.Is_Terms_Agreed AS IsTermsAgreed,
		  ifnull(vl.Checked_In,null) CheckedIn,
		  ifnull(vl.Checked_Out,null) CheckedOut,
		  vd.Is_Edited_Image IsEditedImage
		  from Visitor_Entry ve     
		  inner join Metadata m on m.Meta_Sub_Id=ve.Visitor_Type_Id    
		  inner join Metadata m4 on m4.Meta_Sub_Id=ve.Purpose_Of_Visit    
		  left join Visitor_Entry_Detail vd on vd.Visitor_Entry_Id=ve.Visitor_Entry_Id   
		  inner join plant p on ve.Plant_Id=p.Plant_Id  
		  left join visitor_detail vid on vid.Visitor_Detail_Id  = vd.Visitor_Id
          left join Visitor v on v.Visitor_Id=vid.Visitor_Id  
		  inner join Users u on ve.Visited_Employee_Id=u.User_Id  
		  inner join Role r on r.Role_Id = u.Default_Role_Id
		  left join Visitor_Entry_Log vl on vl.Visitor_Entry_Detail_Id = vd.Visitor_Entry_Detail_Id and date(vl.Checked_In) = curdate()
		--   where vid.visitor_detail_Code=VisitorEntryCode  and vd.Visitor_Entry_Detail_Id=DetailId;
		  where ve.Visitor_Entry_Code=VisitorEntryCode and vd.Visitor_Entry_Detail_Id=DetailId -- and p.Check_Token is not null and p.Check_Token != "" 
          and p.status=1;
          -- and curdate() between date(vd.Valid_From) and date(vd.Valid_To);
    
		  select   
		  ved.Visitor_Entry_Detail_Id VisitorEntryDetailId,  
		  ved.Visitor_Entry_Id VisitorEntryId,  
		  ve.Visitor_Entry_Code VisitorEntryCode,
          ved.Visitor_Entry_Detail_Code VisitorEntryDetailCode,
		  ve.Visitor_Type_Id VisitorTypeId,
          ved.Visitor_Id VisitorId,
		  ved.Title_id Titleid,  
		  ved.First_Name FirstName,  
		  ved.Last_Name LastName,  
		  ved.Department_Id DepartmentId,  
		  ved.Dob Dob,  
		  ved.Mail_Id MailId,  
		  ved.Mobile_No MobileNo,  
          ved.Tag_No TagNo,
		  ved.Visitor_Company VisitorCompany,
		  ved.Id_Card_Type IdCardType,  
		  ved.Id_Card_No IdCardNo,  
		  ved.Document_Name DocumentName,  
		  concat(SchemeDetail,ved.Document_Name) DocumentUrl,  
		  ved.Document_Name DocumentUrl,
		  ved.Digital_Sign_Name AS DigitalSignName,
          ved.Digital_Sign_URL AS DigitalSignURL,
		  ved.Signed_Version AS SignedVersion,
          ved.Is_Terms_Agreed AS IsTermsAgreed,
		  ved.Status Status,
		  ved.Is_Edited_Image IsEditedImage,
		  ved.Valid_From ValidFrom,
		  ved.Valid_To ValidTo
		  from Visitor_Entry_Detail ved 
		  inner join Visitor_Entry ve on ve.Visitor_Entry_Id = ved.Visitor_Entry_Id
         -- inner join visitor_detail vd on vd.Visitor_Id = ve.Visitor_Id
		  where ved.Visitor_Entry_Id=VisitorEntryId;  

			select 
			v.Visitor_Id VisitorId,
            vd.Visitor_Detail_Id VisitorDetailId, 
            vd.visitor_detail_Code VisitorDetailCode, 
			v.Visitor_Code VisitorCode,
			v.Visitor_Type_Id VisitorTypeId,
			v.Company_Id CompanyId,
			v.Plant_Id PlantId,
			v.Country_Id CountryId,
			v.State_Id StateId,
			v.City_Id CityId, 
			v.Title_id Titleid,
			-- concat(m.Meta_Sub_Description,'. ',v.First_Name,' ',v.Last_Name) FirstName,
			concat(v.First_Name,' ',v.Last_Name) FirstName,
			v.Last_Name LastName,
			v.Dob,
			vd.Visitor_Company VisitorCompany,
            vd.Tag_No TagNo,
			v.Address,
			v.Mail_Id MailId,
			v.Mobile_No MobileNo,
			v.Id_Card_Type IdCardType,
			v.Id_Card_No IdCardNo,
			v.Document_Name DocumentName,
			v.Document_Url DocumentUrl,
			vd.Digital_Sign_Name AS DigitalSignName,
            vd.Digital_Sign_URL AS DigitalSignURL,
            vd.Signed_Version AS SignedVersion,
            vd.Is_Terms_Agreed AS IsTermsAgreed,
			v.Status,
			v.Created_By CreatedBy,
			v.Created_On CreatedOn,
			v.Modified_By ModifiedBy,
			v.Modified_On ModifiedOn
			from Visitor v  
			inner join Metadata m on m.Meta_Sub_Id=Title_id
            inner join visitor_detail vd on vd.Visitor_Id = v.Visitor_Id
			where v.Status=1 and v.Company_Id = CompanyId  and v.Plant_Id = PlantId
			order by ifnull(v.Created_On, v.Modified_On) desc;

			select
            Visitor_Entry_Belonging_Detail_Id,
			Visitor_Entry_Id,
			 CASE 
			WHEN Device_No IS NULL OR Device_No = '' THEN 0 
				ELSE Device_No 
			END AS Device_No,
			Device_Name
            from 
			Visitor_Entry_Belonging_Detail  
			where Visitor_Entry_Id=VisitorEntryId;
            
            -- Visitor Documnet Detail
			select
			vd.Visitor_Doc_Id AS VisitorDocId
			,vd.Visitor_Id AS VisitorId
			,vd.Id_Card_Type AS IdCardType
			,vd.Id_Card_No AS IdCardNo
			,vd.Id_Card_Url AS IdCardUrl
			,CONCAT(SchemeDoc, vd.Id_Card_Url) AS LocalPreviewUrl
			,vd.Status AS Status
			from
			visitor v
			Inner Join visitor_doc_detail vd on vd.Visitor_Id = v.Visitor_Id
			Inner Join visitor_entry ve on ve.Visitor_Id = v.Visitor_Id
            Where ve.visitor_entry_id = VisitorEntryId;
            
	 end if;

	if type='OnChangeEntryDetail'    
	 then    
	   select   
	   Visitor_Entry_Detail_Id VisitorEntryDetailId,  
	   Visitor_Entry_Id VisitorEntryId,  
	   Title_id Titleid,  
	   First_Name FirstName,  
	   Last_Name LastName,  
	   Department_Id DepartmentId,  
	   Dob Dob,  
	   Mail_Id MailId,  
	   Mobile_No MobileNo, 
       Tag_No TagNo,
	   Visitor_Company VisitorCompany,
	   Id_Card_Type IdCardType,  
	   Id_Card_No IdCardNo,  
	   Document_Name DocumentName,  
	   concat(SchemeDetail,Document_Name) DocumentUrl,  
	   Status Status  
	   from Visitor_Entry_Detail where Visitor_Entry_Id=VisitorEntryId and Visitor_Entry_Detail_Id = VisitorDetailId;
	 end  if;
	if Type='FilterVehicleNo'
	then

			SELECT 
				v.Vehicle_Id AS VehicleId,
				v.Vehicle_No AS VehicleNo,
				v.Vehicle_Model AS VehicleModel,
				v.Vehicle_Type AS VehicleTypeId
			FROM 
				Vehicle v
			WHERE 
                v.Vehicle_No LIKE CONCAT('%',text, '%')
				AND v.Status = 1 and v.Company_Id = CompanyId and v.Plant_Id = PlantId;

        
	end if;
    
    
    if Type='FilterDriver'
	then
		select
		u.User_Id UserId,
		u.User_Name UserName,
		u.Password Password,
		u.Company_Id CompanyId,
		u.Plant_Id PlantId,
		u.User_Code UserCode,
		u.Default_Role_Id DefaultRoleId,
		u.User_Email UserEmail,
		u.User_Tel_No UserTelNo,
		u.Status Status,
		u.Created_By CreatedBy,
		u.Created_On CreatedOn,
		u.Modified_By ModifiedBy,
		u.Modified_On ModifiedOn,
		u.is_blocked isblocked,
		u.user_image_name userimagename,
		u.user_image_url userimageurl,
		u.Gate_Id GateId,
		u.Secondary_Mobile_No SecondaryMobileNo,
		u.Address Address,
		u.Dept_Id DeptId
		from users u 
		inner join role r on r.Role_Id = u.Default_Role_Id
		where u.User_Name like CONCAT('%',text,'%') and u.Company_Id = CompanyId and u.Plant_Id = PlantId and u.Status = 1; -- Driver;
	end if;
		if Type='OnChangeVehicleNo'
			then
					
		DROP TEMPORARY TABLE IF EXISTS VISENT;

		CREATE TEMPORARY TABLE IF NOT EXISTS VISENT AS
		(
		  
		  SELECT *
		  FROM (
			SELECT 
			  ve.Visitor_Entry_Id AS VisitorEntryId,
			  ve.Visitor_Entry_Code AS VisitorEntryCode,
			  ve.Visitor_Entry_Date AS VisitorEntryDate,
			  ve.Valid_From AS ValidFrom,
			  ve.Valid_To AS ValidTo,
			  ve.Vehicle_Name AS VehicleName,
			  ve.Vehicle_No AS VehicleNo,
			  ve.Vehicle_Model AS VehicleModel,
			  ve.Driver_Id AS DriverId,
			  COALESCE(ve.Driver_Name, u.user_Name) AS DriverName,
			  ve.Vehicle_Type_Id AS VehicleTypeId,
			  ve.Entry_Type AS EntryType,
			  ve.Entry_Time AS EntryTime,
			  ve.Exit_Time AS ExitTime,
			  ve.Number_Of_Passengers AS NumberOfPassengers,
			  ve.Starting_Km AS StartingKm,
			  ve.Ending_Km AS EndingKm,
			  ve.Purpose_Of_Visit AS PurposeOfVisit,
			  ve.Is_Eway_Bill_No AS IsEwayBillNo,
			  ve.Is_Einv_Bill_No AS IsEinvBillNo,
			  ve.Visitor_Remarks AS VisitorRemarks,
			  ve.Created_By AS CreatedBy,
			  ve.Created_On AS CreatedOn,
			  ve.Modified_By AS ModifiedBy,
			  ve.Modified_On AS ModifiedOn,
			  ve.Status AS Status
			FROM 
			  visitor_entry ve
			LEFT JOIN users u ON u.user_Id = ve.Driver_Id 
			WHERE 
			  ve.Vehicle_No like CONCAT('%', VehicleNo, '%')
			  AND ve.Entry_Type IS NOT NULL
			  AND (ve.Entry_Time IS NULL OR ve.Exit_Time IS NULL)
			  AND ve.Status IN (75)
			ORDER BY ve.Entry_Time DESC
			LIMIT 1
		  ) latest_entry

		)


		UNION ALL

		SELECT 
		  NULL AS VisitorEntryId,
		  NULL AS VisitorEntryCode,
		  NULL AS VisitorEntryDate,
		  NULL AS ValidFrom,
		  NULL AS ValidTo,
		  v.Vehicle_Name AS VehicleName,
		  v.Vehicle_No AS VehicleNo,
		  v.Vehicle_Model AS VehicleModel,
		  v.Driver_Id AS DriverId,
		  u.user_Name AS DriverName,
		  v.Vehicle_Type AS VehicleTypeId,
		  NULL AS EntryType,
		  NULL AS EntryTime,
		  NULL AS ExitTime,
		  NULL AS NumberOfPassengers,
		  NULL AS StartingKm,
		  NULL AS EndingKm,
		  v.Purpose_Of_Visit AS PurposeOfVisit,
		  NULL AS IsEwayBillNo,
		  NULL AS IsEinvBillNo,
		  NULL AS VisitorRemarks,
		  NULL AS CreatedBy,
		  NULL AS CreatedOn,
		  NULL AS ModifiedBy,
		  NULL AS ModifiedOn,
		  NULL AS Status
		FROM 
		  vehicle v
		LEFT JOIN users u ON u.user_Id = v.Driver_Id 
		WHERE 
		  v.Vehicle_No like CONCAT('%', VehicleNo, '%')
		  AND v.Status = 1
		LIMIT 1;

		SELECT * FROM VISENT;

	
		  SELECT 
			rd.Visitor_Entry_Ref_Detail_Id AS VisitorEntryRefDetailId, 
			rd.Visitor_Entry_Id AS VisitorEntryId, 
			rd.Ref_Type_Id AS RefTypeId, 
			rd.Ref_Value AS RefValue
		  FROM 
			Visitor_Entry_Ref_Detail rd;
		--   WHERE
-- 			rd.Visitor_Entry_Id = (SELECT VisitorEntryId FROM VISENT LIMIT 1);

				
		select * from Metadata where Meta_Type_Code='REF';
	end if;
if Type='OnChangeExistVehicleNo'
	then
				SELECT 
				ve.Visitor_Entry_Id AS VisitorEntryId,
				ve.Visitor_Entry_Code AS VisitorEntryCode,
				ve.Visitor_Entry_Date AS VisitorEntryDate,
				ve.Valid_From AS ValidFrom,
				ve.Valid_To AS ValidTo,
				ve.Vehicle_Name AS VehicleName,
				ve.Vehicle_No AS VehicleNo,
				ve.Vehicle_Model AS VehicleModel,
				ve.Driver_Id AS DriverId,
				ve.Driver_Name AS DriverName,
				ve.Vehicle_Type_Id AS VehicleTypeId,
				ve.Entry_Type AS EntryType,
				ve.Entry_Time AS EntryTime,
				ve.Exit_Time AS ExitTime,
				ve.Number_Of_Passengers AS NumberOfPassengers,
				ve.Starting_Km AS StartingKm,
				ve.Ending_Km AS EndingKm,
				ve.Purpose_Of_Visit AS PurposeOfVisit,
				ve.Is_Eway_Bill_No AS IsEwayBillNo,
				ve.Is_Einv_Bill_No AS IsEinvBillNo,
				ve.Visitor_Remarks AS VisitorRemarks,
				ve.Created_By AS CreatedBy,
				ve.Created_On AS CreatedOn,
				ve.Modified_By AS ModifiedBy,
				ve.Modified_On AS ModifiedOn,
				ve.Status AS Status
			FROM 
				visitor_entry ve
			WHERE 
				ve.Visitor_Entry_Id = VisitorEntryId;
			
			SELECT 
				rd.Visitor_Entry_Ref_Detail_Id AS VisitorEntryRefDetailId,
				rd.Visitor_Entry_Id AS VisitorEntryId,
				rd.Ref_Type_Id AS RefTypeId,
				rd.Ref_Value AS RefValue
			FROM
				Visitor_Entry_Ref_Detail rd
			WHERE
				rd.Visitor_Entry_Id = VisitorEntryId;
            
			SELECT 
				*
			FROM
				Metadata
			WHERE
				Meta_Type_Code = 'REF';
	end if;
	    if Type='OnChangeVehicleCode'
	then
		select
        v.Vehicle_Id VehicleId,
        v.Vehicle_No VehicleNo,
        v.Vehicle_Type VehicleType,
        v.Vehicle_Name VehicleName
        from
        vehicle v where v.Vehicle_No = VehicleNo;

	end if;
	if Type='VehicleData'
	then
		select * from Visitor_Entry v 
		where v.Vehicle_No = VehicleData and v.Starting_Km is not null and v.Ending_Km is null and v.Plant_Id= PlantId 
		and v.Company_Id = CompanyId
		order by v.Created_On desc
        limit 1;
	end if;
	if Type='OnChangePlant'    
	then
		select 
			d.Department_Id DepartmentId,
			d.Department_Name DepartmentName,
			d.Department_Code DepartmentCode,
			d.Company_Id CompanyId,
			d.Plant_Id PlantId,
			d.Status Status,
			d.Created_By CreatedBy,
			d.Created_On CreatedOn,
			d.Modified_By ModifiedBy,
			d.Modified_On ModifiedOn
		from Department d    
		where d.Plant_Id = PlantId and d.Status=1;
		select * from Area a where a.Status=1 and a.Plant_Id = PlantId;
		end if;
	if Type='OnChangeDepartment'    
		then
			select 
			u.User_Id UserId,
			u.User_Name UserName,
			u.Password Password,
			u.Company_Id CompanyId,
			c.Company_Name CompanyName,
			u.Plant_Id PlantId,
			u.User_Code UserCode,
			u.Default_Role_Id DefaultRoleId,
			u.User_Email UserEmail,
			u.User_Tel_No UserTelNo,
			u.Status Status,
			u.Created_By CreatedBy,
			u.Created_On CreatedOn,
			u.Modified_By ModifiedBy,
			u.Modified_On ModifiedOn,
			u.is_blocked isblocked,
			u.user_image_name userimagename,
			u.user_image_url userimageurl,
			u.Gate_Id GateId,
			u.Secondary_Mobile_No SecondaryMobileNo,
			u.Address Address,
			u.Dept_Id DeptId
			from Users u 
			inner join role  r on r.Role_Id=u.Default_Role_Id 
			inner join Company c on c.Company_Id = u.Company_Id
			where u.Status=1 and u.Dept_Id = DeptId -- and c.Check_Token is not null and c.Check_Token != ""
			and (PlantId IS NULL OR u.Plant_Id = PlantId)
			order by u.Created_On, u.Modified_On desc;
		end  if;
	if Type='OnChangeVisHost'
        then
			select *,
			v.Company_Id CompanyId,  
			v.Plant_Id PlantId,
			vi.Visitor_Company VisitorCompany,
			v.Gate_Id GateId,  
			v.Visitor_Entry_Id VisitorEntryId,  
			v.Visitor_Entry_Code VisitorEntryCode,  
			v.Visitor_Entry_Date VisitorEntryDate,  
			v.Visitor_Type_Id VisitorTypeId,  
			v.Visitor_Id VisitorId,  
			v.Person_Name PersonName,  
			v.Mobile_No MobileNo,  
			v.Id_Proof_Type IdProofType,  
			v.Id_Proof_No IdProofNo,  
			v.Visited_Employee_Id VisitedEmployeeId,  
			concat(ved.First_Name,' ', ved.Last_Name, '') PersonToVisit,  
			v.Valid_From ValidFrom,  
			v.Valid_To ValidTo,  
			v.Access_Type AccessType,  
			v.Is_Extended IsExtended,  
			v.Is_Appointment_Booking IsAppointmentBooking,  
			v.Is_Pre_Booking IsPreBooking,  
			v.Visitor_Remarks VisitorRemarks,  
			v.Purpose_Of_Visit PurposeOfVisit,  
			v.Visitor_Image_Name VisitorImageName,  
			v.Dc_Number DcNumber,  
			v.Party_Type PartyType,  
			v.Party_Name PartyName,  
			v.Invoice_Number InvoiceNumber,  
			v.Po_Number PoNumber,  
			v.Container_Number ContainerNumber,  
			v.Is_Existing_Vehicle IsExistingVehicle,  
			v.Vehicle_Name VehicleName,  
			v.Vehicle_No VehicleNo,  
			v.Number_Of_Passengers NumberOfPassengers,  
			v.Is_Existing_Driver IsExistingDriver,  
			v.Driver_Id DriverId,  
			v.Vehicle_Document_Name VehicleDocumentName,  
			v.Route_Id RouteId,  
			v.Starting_Km StartingKm,  
			v.Ending_Km EndingKm,  
			v.Status Status,  
			v.Created_By CreatedBy,  
			v.Created_On CreatedOn,  
			v.Modified_By ModifiedBy,  
			v.Modified_On Modified_On,
			CONCAT(ved.First_Name,' ',ved.Last_Name) WorkerName,
			ved.Mail_Id MailId,
			ved.Mobile_No MobileNo,
			ved.Visitor_Company VisitorCompany,
            ved.Tag_No TagNo
			from Visitor_Entry v 
			inner join Visitor_Entry_Detail ved on ved.Visitor_Entry_Id = v.Visitor_Entry_Id
			inner join Visitor vi on vi.Visitor_Id = v.Visitor_Id
            where v.Visited_Employee_Id = UserId and v.Visitor_Id = VisitorId
			and v.Plant_Id= PlantId 
			and v.Company_Id = CompanyId
            order by ifnull(v.Modified_On,v.Created_On) desc
            limit 1;

			select * from 
			Visitor_Entry_Belonging_Detail 
			where Visitor_Entry_Id=VisitorEntryId;

        end if;
	if type='OnChangeWorkPermit'
	then
		select 
		wp.Company_Id CompanyId,
		wp.Plant_Id PlantId,
		wp.Gate_Id GateId,
		wp.Work_Permit_Id WorkPermitId,
		wp.Work_Permit_Code WorkPermitCode,
		wp.Work_Permit_Date WorkPermitDate,
		wp.Valid_From ValidFrom,
		wp.Valid_To ValidTo,
		wp.Contract_Name ContractName,
		wp.Work_Organizer WorkOrganizer,
		wp.Po_No PoNo,
		wp.Status_Remarks StatusRemarks,
		wp.Status Status,
		m.Meta_Sub_Description StatusName,
		wp.Created_By CreatedBy,
		wp.Created_On CreatedOn,
		wp.Modified_By ModifiedBy,
		wp.Modified_On ModifiedOn
		from
		Work_Permit wp
		inner join Metadata m on m.Meta_Sub_Id = wp.Status
		where wp.Work_Permit_Id = WorkPermitId and wp.Status = 75
		-- inner join Approval a on a.Document_No = wp.Work_Permit_Code
		-- inner join Approval_Detail ad on ad.Approval_Id = a.Approval_Id
		order by WorkPermitDate desc;

		select 
		wd.WP_Worker_Detail_Id WPWorkerDetailId,
		wd.Work_Permit_Id WorkPermitId,
		wd.Worker_Name WorkerName,
		wd.Mail_Id WorkerMailID,
		wd.Mobile_No WorkerPhoneNo,
		wd.Status Status,
		m.Meta_Sub_Description WorkerStatus
		from
		WP_Worker_Detail wd
		inner join Metadata m on m.Meta_Sub_Id = wd.Status
		where wd.Work_Permit_Id = WorkPermitId and 
		wd.Status = 1;

		select 
		ve.Visitor_Entry_Id VisitorEntryId,
		ve.Visitor_Entry_Code VisitorEntryCode,
		ved.Valid_From ValidFrom,
		ved.Valid_To ValidTo
		from
		Visitor_Entry ve 
		inner join Visitor_Entry_Detail ved on ved.Visitor_Entry_Id = ve.Visitor_Entry_Id
		where ve.Ref_No = WorkPermitCode;

	end if;
    
	
end//

DELIMITER ;