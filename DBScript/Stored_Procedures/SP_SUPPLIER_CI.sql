DELIMITER //
DROP PROCEDURE IF EXISTS SP_SUPPLIER_CI;
CREATE  PROCEDURE SP_SUPPLIER_CI       
(
	IN Type longtext,      
	IN SupplierId bigint ,  
	IN CountryId bigint ,  
	IN StateId bigint ,  
	IN Scheme longtext,
	IN CompanyId bigint,
    IN PlantId bigint ,
    IN RoleId BIGINT
)  
begin     
if( Type='CreateInitialize')      
then      
 select * from Metadata  where Meta_Type_Code = 'STA' ;      
 select * from Metadata  where Meta_Type_Code = 'SCY'  ;    
 select * from Metadata  where Meta_Type_Code = 'STY' ;     
 select * from Country c where Status = 1;    
 if( SupplierId >0)      
 then      
  select * from State c where Status = 1   ;
  select * from City c  where Status = 1   ; 
  select   
  Supplier_Id,  
  Supplier_Name,  
  Supplier_Code,  
  Supplier_Category_Id,  
  Series_Id,  
  Supplier_Type_Id,  
  Supplier_Pan_No,  
  Supplier_Tin_No,  
  Supplier_Ecc_No,  
  Supplier_Vat_No,  
  Supplier_Gst_No,  
  Supplier_Cst_No,  
  Supplier_Area_Code,  
  Supplier_Is_Local,  
  Company_Id,  
  Plant_Id,  
  Supplier_Image_Name,  
   Scheme+Supplier_Image_Name SupplierImageUrl,  
  Supplier_Mobile_No,  
  Supplier_Mail_Id, 
  Supplier_Mobile_No2,  
  Supplier_Mail_Id2,
  Status,  
  Created_By,  
  Created_On,  
  Modified_By,  
  Modified_On,
  Country_Id  ,  
  State_Id  ,  
  City_Id   ,
  Address
  from Supplier where  Supplier_Id= SupplierId  ;
  select * from Supplier_BillingDetails where Supplier_Id =  SupplierId  ;
 end if;     
end if; 
if(Type='OnChangeCountry')    
then   
 select * from State c where Status = 1  and Country_Id= CountryId  ;
end if;   
if(Type='OnChangeState')    
then  
 select * from City c where Status = 1  and State_Id= StateId  ;
end if;   
if( Type='SearchInitialize')      
then    
 select  
 s.Supplier_Id SupplierId,  
 s.Supplier_Name SupplierName,  
 s.Supplier_Code SupplierCode,  
 s.Supplier_Category_Id SupplierCategoryId,  
 m1.Meta_Sub_Description CategoryName,  
 s.Series_Id SeriesId,  
 s.Supplier_Type_Id SupplierTypeId,  
 m2.Meta_Sub_Description SupplierTypeName,  
 s.Supplier_Pan_No SupplierPanNo,  
 s.Supplier_Tin_No SupplierTinNo,  
 s.Supplier_Ecc_No SupplierEccNo,  
 s.Supplier_Vat_No SupplierVatNo,  
 s.Supplier_Gst_No SupplierGstNo,  
 s.Supplier_Cst_No SupplierCstNo,  
 s.Supplier_Area_Code SupplierAreaCode,  
 s.Supplier_Is_Local SupplierIsLocal,  
 s.Company_Id CompanyId,  
 c.Company_Name CompanyName,  
 s.Plant_Id PlantId,  
 p.Plant_Name PlantName,  
 s.Status Status,  
 m.Meta_Sub_Description StatusName,  
 s.Created_By CreatedBy,  
u.User_Name CreatedByName,
CONVERT(s.Created_On, CHAR(19)) CreatedOn,
ifnull(CONVERT(s.Modified_On  , CHAR(19)),CONVERT(s.Created_On , CHAR(19))) ModifiedOn  ,
ifnull(u.User_Name,u1.User_Name) ModifiedByName, 
s.Modified_By ModifiedBy,
 s.Supplier_Mobile_No SupplierMobileNo,  
 s.Supplier_Mail_Id SupplierMailId,  
 s.Country_Id  CountryId,  
 s.State_Id  StateId,  
 s.City_Id  CityId  
  
 from Supplier s     
 inner join MetaData m on m.Meta_Sub_Id = s.Status    
 inner join MetaData m1 on m1.Meta_Sub_Id = s.Supplier_Category_Id  
 inner join MetaData m2 on m2.Meta_Sub_Id = s.Supplier_Type_Id  
 inner join Company c on c.Company_Id = s.Company_Id    
 inner join Plant p on p.Plant_Id = s.Plant_Id    
 inner join Users u on u.User_Id=s.Created_By  
 left join Users u1 on u1.User_Id=s.Modified_By  
  where s.Company_Id= CompanyId and s.Plant_Id = PlantId and p.Check_Token is not null and p.Check_Token != "" and c.Check_Token is not null and c.Check_Token != "" and p.status=1 and c.status=1
 order by  ifnull(s.Modified_On,s.Created_On) desc  ;
end if;
end //
DELIMITER ;    