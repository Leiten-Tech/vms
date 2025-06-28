DELIMITER //
DROP PROCEDURE IF EXISTS SP_INSTRUCTIONS_CI;
create procedure SP_INSTRUCTIONS_CI       
(      
	IN Type longtext,      
	IN CompanyId bigint,
	IN InstructionsId bigint,
    IN PlantId bigint ,
    IN RoleId BIGINT
)       
BEGIN      
if(Type='CreateInitialize')      
 then
 select 
Meta_Sub_Id MetaSubId,
Meta_Type_Code MetaTypeCode,
Meta_Sub_Code MetaSubCode,
Meta_Type_Name MetaTypeName,
Meta_Sub_Description MetaSubDescription,
Status Status,
Meta_Sub_Description StatusName,
Created_By CreatedBy,
Modified_By ModifiedBy,
Modified_On ModifiedOn    
 from Metadata where Meta_Type_Code = 'STA' ;
 select 
Meta_Sub_Id MetaSubId,
Meta_Type_Code MetaTypeCode,
Meta_Sub_Code MetaSubCode,
Meta_Type_Name MetaTypeName,
Meta_Sub_Description MetaSubDescription
 from Metadata where Meta_Type_Code = 'VIY';
 select 
 Plant_Id PlantId,
 Plant_Name PlantName
 from Plant  where Status =1;
select
 Company_Id CompanyId,
Company_Code CompanyCode,
Company_Name CompanyName,
 Status Status,
Created_By CreatedBy,
Created_On CreatedOn,
Modified_By ModifiedBy,
Modified_On ModifiedOn,
Country_Id CountryId,
city_Id cityId,
State_Id StateId
 from Company where Status =1;
 if(InstructionsId >0)      
   then
 select * from Instructions where  Instructions_Id=InstructionsId;   
 end if;   
 end if;
 -- new 
 if(Type='OnChangeCompany')
	then
		select*from Plant where Status=1 and Company_Id=CompanyId;
	end if;
if(Type='SearchInitialize')      
 then
select    
i.Visitor_Type_Id VisitorTypeId,
 m1.Meta_Sub_Description VisitorTypeName,    
 i.Instructions_Id InstructionsId, 
 i.Company_Id CompanyId,    
 cv.Company_Name CompanyName,
 i.Plant_Id PlantId,
 p.Plant_Name PlantName, 
 i.Status Status,
 m.Meta_Sub_Description StatusName,
 i.Points Points,
 i.Version Version,
 i.Is_Enabled IsEnabled,
 i.Instruction_Name InstructionName
 from Instructions i     
 inner join MetaData m on m.Meta_Sub_Id = i.Status 
 left join MetaData m1 on m1.Meta_Sub_Id = i.Visitor_Type_Id
 left join Company cv on cv.Company_Id = i.Company_Id
 left join Plant p on p.Plant_Id = i.Plant_Id
WHERE 
    i.Version in (
        SELECT MAX(Version) 
        FROM Instructions 
        WHERE Instruction_Name = i.Instruction_Name);
 -- where i.Company_Id = CompanyId and i.Plant_Id = PlantId and p.Check_Token is not null and p.Check_Token != "" and cv.Check_Token is not null and cv.Check_Token != "" and p.status=1 and cv.status=1;
end if;      
END //
DELIMITER ; 