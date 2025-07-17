DELIMITER //

DROP PROCEDURE IF EXISTS SP_VISITOR_RESCHEDULE_EX;
//
CREATE PROCEDURE SP_VISITOR_RESCHEDULE_EX (
	IN Type LONGTEXT,
	IN VisitorEntryId BIGINT,
	IN CompanyId BIGINT,
    IN RoleId BIGINT,
    IN PrimaryUserId BIGINT
)
BEGIN
	IF Type = 'GetRescheduleVisList' THEN

        -- Visitor Entry Header
        select 
		V.Company_Id AS CompanyId,
		V.Plant_Id AS PlantId,
		V.Gate_Id AS GateId,
		V.Visitor_Entry_Id AS VisitorEntryId,
		V.Visitor_Entry_Code AS VisitorEntryCode,
		V.Visitor_Entry_Date AS VisitorEntryDate,
		V.Visitor_Type_Id AS VisitorTypeId,
		V.Visitor_Id AS VisitorId,
		V.Person_Name AS PersonName,
		V.Mobile_No AS MobileNo,
		V.Id_Proof_Type AS IdProofType,
		V.Id_Proof_No AS IdProofNo,
		V.Visited_Employee_Id AS VisitedEmployeeId,
		V.Valid_From AS ValidFrom,
		V.Valid_To AS ValidTo,
		V.Access_Type AS AccessType,
		V.Is_Extended AS IsExtended,
		V.Is_Appointment_Booking AS IsAppointmentBooking,
		V.Is_Pre_Booking AS IsPreBooking,
		V.Visitor_Remarks AS VisitorRemarks,
		V.Purpose_Of_Visit AS PurposeOfVisit,
		V.Visitor_Image_Name AS VisitorImageName,
		V.Visitor_Image_Url AS VisitorImageUrl,
		V.Dc_Number AS DcNumber,
		V.Party_Type AS PartyType,
		V.Party_Name AS PartyName,
		V.Invoice_Number AS InvoiceNumber,
		V.Po_Number AS PoNumber,
		V.Container_Number AS ContainerNumber,
		V.Is_Existing_Vehicle AS IsExistingVehicle,
		V.Vehicle_Type_Id AS VehicleTypeId,
		V.Vehicle_Name AS VehicleName,
		V.Vehicle_Model AS VehicleModel,
		V.Driver_Name AS DriverName,
		V.Vehicle_No AS VehicleNo,
		V.Number_Of_Passengers AS NumberOfPassengers,
		V.Is_Existing_Driver AS IsExistingDriver,
		V.Driver_Id AS DriverId,
		V.Vehicle_Document_Name AS VehicleDocumentName,
		V.Vehicle_Document_Url AS VehicleDocumentUrl,
		V.Route_Id AS RouteId,
		V.Starting_Km AS StartingKm,
		V.Ending_Km AS EndingKm,
		V.Entry_Type AS EntryType,
		V.Entry_Time AS EntryTime,
		V.Exit_Time AS ExitTime,
		V.Is_Eway_Bill_No AS IsEwayBillNo,
		V.Is_Einv_Bill_No AS IsEinvBillNo,
		V.Tag_No AS TagNo,
		V.Status AS Status,
		V.Created_By AS CreatedBy,
		V.Created_On AS CreatedOn,
		V.Modified_By AS ModifiedBy,
		V.Modified_On AS ModifiedOn,
		V.IsExternal AS IsExternal,
		V.Is_Internal_Appointment AS IsInternalAppointment,
		V.Ref_No AS RefNo,
		V.is_android_visitor AS IsAndroidVisitor,
		V.is_meeting_close AS IsMeetingClose,
		V.Aadhar_No AS AadharNo,
		V.rescheduled_date_time AS RescheduledDateTime,
		V.previous_Valid_From AS PreviousValidFrom,
		V.previous_Valid_To AS PreviousValidTo,
		V.Visit_End_Time AS VisitEndTime		
		,M1.Meta_Sub_Description AS Statusname
        ,M2.Meta_Sub_Description AS PurposeOfVisitName
        ,U.User_Name AS VisitedEmployeeName
        ,
		(
            SELECT GROUP_CONCAT(DISTINCT m.Area_Name SEPARATOR ', ') AS AreaToVisitName
			FROM Visitor_Entry_Atv_Detail B
			INNER JOIN Area m ON m.Area_Id = b.Area_To_Visit
			WHERE B.Visitor_Entry_Id = VisitorEntryId
		) AS AreaToVisitName
        from visitor_entry v
		LEFT JOIN Metadata M1 on M1.Meta_Sub_Id = v.status
        LEFT JOIN Users U on U.User_Id = v.Visited_Employee_Id
        LEFT JOIN Metadata M2 on M2.Meta_Sub_Id = v.Purpose_Of_Visit
        where Visitor_Entry_Id = VisitorEntryId;
        
        -- Visitor Entry Detail
        select * from visitor_entry_detail where Visitor_Entry_Id = VisitorEntryId;
	END IF;
END