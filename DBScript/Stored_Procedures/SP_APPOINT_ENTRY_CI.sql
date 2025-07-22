DROP PROCEDURE IF EXISTS SP_APPOINT_ENTRY_CI;
DELIMITER //
create procedure SP_APPOINT_ENTRY_CI
(
    IN Type VARCHAR(255),
    IN MobileNo VARCHAR(100),
    IN PlantId BIGINT,
    IN CompanyId BIGINT,
    IN RoleId BIGINT,
    IN Scheme VARCHAR(500),
    IN SchemeDoc VARCHAR(500)
)

begin

if Type="OnEnterMobileNo" then
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
		vd.First_Name PersonName,
		vd.Mobile_No MobileNo,
        vd.Mail_Id MailId,
        v.Tag_No TagNo,
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
        vi.Visitor_Company VisitorCompany,
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
		v.Created_On,
        vd.Is_Terms_Agreed IsTermsAgreed,
        vd.Digital_Sign_Name DigitalSignName,
        CONCAT(Scheme, vd.Digital_Sign_Name) DigitalSignUrl
		from Visitor_Entry v 
		inner join Metadata m on m.Meta_Sub_Id=v.Visitor_Type_Id
		inner join Metadata m3 on m3.Meta_Sub_Id=v.Status
		inner join Metadata m4 on m4.Meta_Sub_Id=v.Purpose_Of_Visit
		inner join Users u on u.User_Id=v.Created_By
		left join Users u1 on u1.User_Id=v.Modified_By
        left join Visitor vi on vi.Visitor_Id = v.Visitor_Id
		-- left join Visitor_Entry_Detail vd on vd.Visitor_Entry_Id=v.Visitor_Entry_Id
        LEFT JOIN Visitor_Entry_Detail vd
			ON vd.Visitor_Entry_Id = v.Visitor_Entry_Id
		   AND v.Created_On = (
			   SELECT MAX(v.Created_On)
			   FROM Visitor_Entry_Detail
			   WHERE Visitor_Entry_Id = v.Visitor_Entry_Id
		   )
		inner join visitor_detail vid on vid.Visitor_Detail_Id = vd.Visitor_Id
        left join Visitor_Entry_Log vl on vl.Visitor_Entry_Code=v.Visitor_Entry_Code and vd.Visitor_Entry_Detail_Id = vl.Visitor_Entry_Detail_Id
		where v.Status = 75 and vd.Mobile_No = MobileNo and v.Company_Id = CompanyId and v.Plant_Id = PlantId
		order by ifnull(v.Modified_On,v.Created_On) desc
        LIMIT 1;
        
        -- Visitor Doc Detail List
        
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
        Inner Join visitor_entry ve on ve.Mobile_No = MobileNo
        where ve.status = 75 and v.Mobile_No = MobileNo and ve.Company_Id = CompanyId and ve.Plant_Id = PlantId
		order by ifnull(v.Modified_On,v.Created_On) desc;
    end if;
	
end//

DELIMITER ;