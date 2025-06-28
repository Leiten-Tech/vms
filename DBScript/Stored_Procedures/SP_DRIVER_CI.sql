
DELIMITER //
DROP PROCEDURE IF EXISTS SP_DRIVER_CI;
CREATE PROCEDURE SP_DRIVER_CI   
(  
	IN Type longtext,    
	IN driverId int
) 
BEGIN    
if(Type='CreateInitialize')    
	then    
	select*from Metadata where Meta_Type_Code = 'STA';
	select e.* from Employee e  
	inner join Role r on r.Role_Id=e.Designation_Id
	where r.Role_Name='Driver';
	select*from Supplier where Status=1;
	if(driverId >0)    
		then
		select * from Driver where  Driver_Id=@driverId;    
		end if;   
	end if;   
if(Type='SearchInitialize')    
	then
	select
	d.Driver_Id DriverId,
	d.Driver_Code DriverCode,
	e.First_Name+' '+e.Last_Name EmpName,
	d.Emp_Id EmpId,
	s.Supplier_Name SupplierName,
	d.Supp_Id SuppId,
	d.Dob Dob,
	d.Age Age,
	d.Driving_Licence_No DrivingLicenceNo,
	d.License_Validity LicenseValidity,
	d.Heavy_Batch_No HeavyBatchNo,
	d.Batch_Validity BatchValidity, 
	d.Driver_Mobile_No DriverMobileNo,
	d.National_Id_No NationalIdNo,
	d.Contact_Address ContactAddress,
	d.Emergency_Contact_Name EmergencyContactName,
	d.Emergency_Contact_No EmergencyContactNo,
	d.Document_Refrence_Name DocumentRefrenceName,
	d.Upload_Document UploadDocument,
	m.Meta_Sub_Description StatusName ,
	d.Status Status,
	u.User_Name CreatedByName,
	d.Created_By CreatedBy,
	d.Created_On CreatedOn,
	u1.User_Name ModifiedByName,
	d.Modified_By ModifiedBy,
	d.Modified_On Modified_On
	from Driver d
	inner join Employee e on e.Employee_Id = d.Emp_Id
	inner join Supplier s on s.Supplier_Id = d.Supp_Id
	inner join Metadata m on m.Meta_Sub_Id = d.Status
	inner join users u on u.User_Id = d.Created_By
	left join Users u1 on u1.User_Id = d.Modified_By;
	end if;   
END //
DELIMITER ;