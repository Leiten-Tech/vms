DROP PROCEDURE IF EXISTS SP_Feedback_CI;
DELIMITER //
create procedure SP_Feedback_CI
(
    IN type VARCHAR(255),
	IN FeedbackId INT,
	IN CompanyId bigint ,
    IN PlantId bigint,
    IN RoleId bigint
)
begin
    if type='CreateInitialize'
	then  
		select * from Metadata where Meta_Type_Code = 'FEB' and Status = 1;
        if (FeedbackId > 0)
                then
					select 
					f.Feedback_Id FeedbackId,
					f.Feedback_Code FeedbackCode,
					f.Feedback_Desc FeedbackDesc,
                    f.User_Id UserId,
                    f.Company_Id CompanyId,
                    f.Plant_Id PlantId,
                    f.Status Status,
                    f.Created_By CreatedBy,
                    f.Created_On CreatedOn,
                    f.Modified_By ModifiedBy,
                    f.Modified_On ModifiedOn
                    from Feedback f
                   where f.Feedback_Id = FeedbackId and f.Plant_Id = PlantId and f.Company_Id = CompanyId;
                   
                   
					select 
					fd.Feedback_Detail_Id FeedbackDetailId,
					fd.Company_Id CompanyId,
                    fd.Plant_Id PlantId,
                    fd.Feedback_Id FeedbackId,
                    fd.Feedback_Type FeedbackType,
                    fd.Star_Rating StarRating,
                    fd.Status Status
                    from Feedback_Detail fd
                   where fd.Feedback_Id = FeedbackId and fd.Plant_Id = PlantId;
                   
				end if;
    end if;

    if type='SearchInitialize'
	then  
					select
					f.Feedback_Id FeedbackId,
					f.Feedback_Code FeedbackCode,
					f.Feedback_Desc FeedbackDesc,
                    ved.First_Name FeedbackUser,
					ved.Mobile_No MobileNo,
                    ved.Visitor_Entry_Detail_Code VisitorEntryDetailCode,
                    f.User_Id UserId,
                    f.Company_Id CompanyId,
                    f.Plant_Id PlantId,
					f.Status Status,
					m.Meta_Sub_Description StatusName,
					f.Created_By CreatedBy,
					u1.User_Name CreatedByName,  
					f.Modified_By ModifiedBy ,
					ifnull(u2.User_Name,u1.User_Name) ModifiedByName, 
					CONVERT(f.Created_On , char(19)) CreatedOn,
					ifnull(CONVERT(f.Modified_On  , CHAR(19)),CONVERT(f.Created_On , CHAR(19))) ModifiedOn
					from Feedback f 
					inner join Metadata m on m.Meta_Sub_Id = f.Status   
                    left join visitor_entry_detail ved on ved.Visitor_Entry_Detail_Id = f.User_Id
					left join users u1 on u1.User_Id = f.Created_By      
					left join users u2 on u2.User_Id = f.Modified_By  
                    where f.Plant_Id = PlantId and f.Company_Id = CompanyId
					order by ifnull(f.Modified_On,f.Created_On)   desc;
                    
	end if;
end//   
DELIMITER ;