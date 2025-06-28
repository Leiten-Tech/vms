DROP PROCEDURE IF EXISTS SP_Category_CP_Map_CI;
DELIMITER //
create procedure SP_Category_CP_Map_CI
(
	IN text VARCHAR(255),
    IN type VARCHAR(255),
	IN CategoryId INT
)
begin
	if Type='CreateInitialize'
	then
				select*from Metadata where Meta_Type_Code = 'STA';
				if (CategoryId > 0)
                then
					select 
					c.CP_Map_Id CPMapId,
					c.Category_Id CategoryId,
					c.Category_Name CategoryName,
                    c.Status Status,
                    c.Created_By CreatedBy,
                    c.Created_On CreatedOn,
                    c.Modified_By ModifiedBy,
                    c.Modified_On ModifiedOn,
                    c.Is_Sys_Generated IsSysGenerated
                    from Category_CP_Map c
                   where c.Category_Id = CategoryId;
                   
                   
					select 
					cd.Category_CP_Map_Detail_Id CategoryCPMapDetailId,
					cd.CP_Map_Id CPMapId,
					cd.Category_Id CategoryId,
                    cd.Description Description,
                    cd.Status Status,
                    cd.Created_By CreatedBy,
                    cd.Created_On CreatedOn,
                    cd.Modified_By ModifiedBy,
                    cd.Modified_On ModifiedOn,
                    cd.Is_Sys_Generated IsSysGenerated
                    from Category_CP_Map_Details cd
                   where cd.Category_Id = CategoryId;
                   
				end if;
	end  if;
    
	if type='FilterCategory'
	then
							select 
							Category_Id,Category_Name 
							from Category
                            WHERE
							Category_Name LIKE CONCAT('%',text,'%') and Status = 1
							LIMIT 10;
							
	end if;
    if type='SearchInitialize'
	then  
					select
					c.CP_Map_Id CPMapId,
					c.Category_Id CategoryId,
					c.Category_Name CategoryName ,
					c.Status Status,
					m.Meta_Sub_Description StatusName,
					c.Created_By CreatedBy,
					u1.User_Name CreatedByName,  
					c.Modified_By ModifiedBy ,
					ifnull(u2.User_Name,u1.User_Name) ModifiedByName, 
					CONVERT(c.Created_On , char(19)) CreatedOn,
					ifnull(CONVERT(c.Modified_On  , CHAR(19)),CONVERT(c.Created_On , CHAR(19))) ModifiedOn,  
                    c.Is_Sys_Generated IsSysGenerated
					from Category_CP_Map c 
					-- inner join Category_CP_Map_Details cd on cd.CP_Map_Id = c.CP_Map_Id
					inner join Metadata m on m.Meta_Sub_Id = c.Status   
					left join users u1 on u1.User_Id = c.Created_By      
					left join users u2 on u2.User_Id = c.Modified_By  
					order by ifnull(c.Modified_On,c.Created_On)   desc;
	end if;
end//   
DELIMITER ;