DELIMITER //
DROP PROCEDURE IF EXISTS SP_VEHICLE_CI;
CREATE PROCEDURE SP_VEHICLE_CI       
(
 IN Type longtext,      
 IN vehicleId bigint,
 IN Schemevehicledetail longtext,
 IN CompanyId bigint,
 IN RoleId bigint,
 IN PlantId bigint
)
BEGIN      
 if(Type='CreateInitialize')      
  then      
   select*from Metadata  where Meta_Type_Code = 'STA'  ;
   select*from Metadata  where Meta_Type_Code = 'VTY'  ;
   select*from Supplier s where s.Status=1 and s.Supplier_Category_Id=77 and s.Company_Id = CompanyId and s.Plant_Id = PlantId;
   select*from Company c where c.Status=1 and c.Company_Id = CompanyId ;
   select*from Plant p where p.Company_Id = CompanyId  and Status=1;
   select 
   *,
   CONCAT(u.User_Name, ' (', u.User_Code, ')') UserName
   from users u where u.Status = 1 and u.Company_Id= CompanyId and u.Plant_Id = PlantId;
   if( vehicleId >0)      
    then      
     select * from Vehicle where  Vehicle_Id= vehicleId ;     
     select
	 Vehicle_Document_Detail_Id,
	 Vehicle_Id,
	 Document_Name,
	 Document_No,
	 concat(Schemevehicledetail,Attachment_Name) AttachmentUrl,
	 Attachment_Name,
	 Remarks
	 from Vehicle_Document_Details where Vehicle_Id= vehicleId ;     
    end if;     
  end if;     
 if( Type='SearchInitialize')      
 then         
  select   
  v.Vehicle_Id VehicleId,  
  v.Vehicle_Code VehicleCode,  
  v.Vehicle_Name VehicleName,  
  v.Company_Id CompanyId,  
  c.Company_Name CompanyName,  
  v.Plant_Id PlantId,  
  p.Plant_Name PlantName,  
  v.Vehicle_Type VehicleType,  
  m.Meta_Sub_Description VehicleTypeName,  
  v.Vehicle_No VehicleNo,  
  v.Supplier_Id SupplierId,  
  s.Supplier_Name SupplierName,  
  v.Supplier_Mobile_No SupplierMobileNo,  
  v.Supplier_Address SupplierAddress,  
  v.Vehicle_Model VehicleModel,  
  v.Vehicle_Token AS VehicleToken,
  ud.User_Name DriverName,
  CONVERT(v.Vehicle_Fc_Date, CHAR(19)) VehicleFcDate,
  CONVERT(v.Service_Date, CHAR(19)) ServiceDate,
  v.Remarks Remarks,  
  v.Status Status,  
  ms.Meta_Sub_Description StatusName,  
  v.Created_By CreatedBy,  
  uc.User_Name CreatedByName,  
  CONVERT(v.Created_On, CHAR(19)) CreatedOn,  
  v.Modified_By ModifiedBy,  
  ifnull(um.User_Name,uc.User_Name) ModifiedByName,  
  ifnull(CONVERT(v.Modified_On, CHAR(19)),CONVERT(v.Created_On, CHAR(19))) ModifiedOn
  from Vehicle v 
  inner join Company c on c.Company_Id=v.Company_Id  
  inner join Plant p on p.Plant_Id = v.Plant_Id  
  inner join Metadata m on m.Meta_Sub_Id = v.Vehicle_Type  
  left join Supplier s on s.Supplier_Id = v.Supplier_Id  
  inner join Metadata ms on ms.Meta_Sub_Id = v.Status  
  inner join users uc on uc.User_Id = v.Created_By  
  left join Users um on um.User_Id = v.Modified_By
  left join Users ud on ud.User_Id = v.Driver_Id
  where p.Check_Token is not null and p.Check_Token != "" and c.Check_Token is not null and c.Check_Token != "" and p.status=1 and c.status=1 and
   (
	RoleId = 1 or
    (RoleId != 1 and v.Company_Id = CompanyId)
 )
  order by ifnull(v.Modified_On,v.Created_On) desc ;
 end  if;     
END  //
DELIMITER ;

