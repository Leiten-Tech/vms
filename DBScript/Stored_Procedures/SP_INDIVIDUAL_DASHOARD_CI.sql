DELIMITER //
DROP PROCEDURE IF EXISTS SP_INDIVIDUAL_DASHOARD_CI;
CREATE PROCEDURE SP_INDIVIDUAL_DASHOARD_CI      
(
	IN Type LONGTEXT,      
	IN FDate varchar(20),    
	IN TDate varchar(20),    
	IN PlantId bigint,   
    IN CompanyId bigint,   
	IN UserId bigint,    
	IN RoleId bigint,    
	IN StsId bigint ,    
	IN Header int
)
BEGIN    
	declare Individual int;       
    declare Contractor int;       
	declare checkedInCount int;
    declare checkedOutCount int;       
	declare InvoiceBased int;
    declare VehicleTripBased int;       
	declare approved int;
    declare pendingApproval int;       
	declare VisitUser int;
    declare GateActive int;       
	declare SecurityLoged int;
    declare InsideVisitor int;
    declare checkedInCountAll int;
    declare checkedOutCountAll int;
	DECLARE  SqlQuery1 longtext;    
    DECLARE  SqlQuery2 longtext;    
    DECLARE  SqlQuery3 longtext;  
    DECLARE  SqlQuery4 longtext;   
    declare AuditingInspection int;
    declare AttendingInterview int;
    declare ContractorTemporaryWork int;
    declare CustomerSupplierMeeting int;
    declare ClientPartnerMeeting int;
    declare DeliveryPickup int;
    declare TrainingWorkshop int;
    declare ServiceMaintenance int;
    declare SalesPresentation int;
    declare Tour int;
    declare Meeting int;
    declare PersonalVisit int;
    declare GovernmentOfficials int;
    declare Consultation int;
    declare EmergencyResponse int;
    declare WorkPermit int;
    declare Others int;
    declare VisCount varchar(255);
    declare ConCount varchar(255);
    declare InvoiceCount varchar(255);
    declare VehicleTripCount varchar(255);
    declare workpermitCount varchar(255);
    declare ColumnList longtext;
     
if(Type='SearchInitialize')        
then      
 -- showing the count     
 
  set Individual= (select COUNT(*) from visitor_entry_detail ve
  inner join visitor_entry v  on v.Visitor_Entry_Id = ve.Visitor_Entry_Id
 inner join Company c on c.Company_Id= v.Company_Id  
 where cast(Visitor_Entry_Date as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') 
 and Visitor_Type_Id=35  and Plant_Id=PlantId and c.Status=1 and v.Status = 75);        
  set Contractor= (select COUNT(*) from visitor_entry_detail ve
  inner join visitor_entry v  on v.Visitor_Entry_Id = ve.Visitor_Entry_Id
 inner join Company c on c.Company_Id= v.Company_Id  
 where cast(Visitor_Entry_Date as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') 
 and  Visitor_Type_Id=36 and Plant_Id=PlantId and c.Status=1 and v.Status = 75); 
  set InvoiceBased= (select COUNT(*)from Visitor_Entry  v  
 inner join Company c on c.Company_Id= v.Company_Id  
 where cast(Visitor_Entry_Date as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and  Visitor_Type_Id=65  and Plant_Id=PlantId and c.Status=1);       
  set VehicleTripBased= (select COUNT(*)from Visitor_Entry  v  
 inner join Company c on c.Company_Id= v.Company_Id  
 where cast(Visitor_Entry_Date as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') 
 and  Visitor_Type_Id=66  and Plant_Id=PlantId and c.Status=1);     
  set checkedInCount = (select COUNT(*)from Visitor_Entry_Log vl     
    inner join Visitor_Entry ve on ve.Visitor_Entry_Code = vl.Visitor_Entry_Code    
    inner join Company c on c.Company_Id= ve.Company_Id  
    where cast(Checked_In as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and ve.Plant_Id=PlantId and ve.Visited_Employee_Id=UserId and c.Status=1);      
  set checkedOutCount = (select COUNT(*)from Visitor_Entry_Log vl     
   inner join Visitor_Entry ve on ve.Visitor_Entry_Code=vl.Visitor_Entry_Code    
   inner join Company c on c.Company_Id= ve.Company_Id  
   where cast(Checked_Out as  date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')  and ve.Plant_Id=PlantId and ve.Visited_Employee_Id=UserId and c.Status=1);     
  set checkedInCountAll = (select COUNT(*)from Visitor_Entry_Log vl     
   inner join Visitor_Entry ve on ve.Visitor_Entry_Code = vl.Visitor_Entry_Code   
   inner join Company c on c.Company_Id= ve.Company_Id  
   where cast(Checked_In as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and ve.Plant_Id=PlantId and c.Status=1);      
  set checkedOutCountAll = (select COUNT(*)from Visitor_Entry_Log vl     
   inner join Visitor_Entry ve on ve.Visitor_Entry_Code=vl.Visitor_Entry_Code     
   inner join Company c on c.Company_Id= ve.Company_Id  
   where cast(Checked_Out as  date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')  and ve.Plant_Id=PlantId and c.Status=1);     
  SET GateActive = (SELECT COUNT(*) FROM GATE g   
   inner join Company c on c.Company_Id= g.Company_Id  
   where cast(g.Gate_Open_Time as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and  g.Status=1 and g.Plant_Id=PlantId and c.Status=1); -- GATE ACTIVE    
  SET SecurityLoged = (SELECT COUNT(*) FROM User_Session u     
   -- inner join role r on r.Role_Id = u.Logged_Role    
   inner join Company c on c.Company_Id= u.Company_Id  
   WHERE cast(u.Logged_In_On as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and  date(u.Logged_In_On) = curdate() and u.Logged_Role=5 and u.Plant_Id=PlantId  and c.Status=1);    
  SET approved = (SELECT COUNT(*) FROM Approval_Detail ad      
   inner join Approval a on a.Approval_Id =ad.Approval_Id      
   inner join users u on u.User_Id = UserId      
   inner join users ui on ui.User_Id =a.Created_By     
   inner join plant p on p.Plant_Id= a.Plant_Id      
   inner join Company c on c.Company_Id= u.Company_Id  
   where date(ifnull(ad.Modified_On,ad.Created_On)) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and  a.Plant_Id = PlantId and (ad.Primary_User_Id=UserId or ad.Secondary_User_Id=UserId) and a.Status = 75  and c.Status=1  
   and p.Check_Token is not null and p.Check_Token != "" and c.Check_Token is not null and c.Check_Token != "" and p.status=1); -- approved      
  SET pendingApproval = (SELECT COUNT(*) FROM Approval_Detail ad      
   inner join Approval a on a.Approval_Id =ad.Approval_Id      
   inner join users u on u.User_Id = UserId      
   inner join users ui on ui.User_Id =a.Created_By     
   inner join plant p on p.Plant_Id= a.Plant_Id    
   inner join Company c on c.Company_Id= u.Company_Id  
   where date(ifnull(ad.Modified_On,ad.Created_On)) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') 
   and  a.Plant_Id = PlantId and (ad.Primary_User_Id=UserId or ad.Secondary_User_Id=UserId) and a.Status = 74  and c.Status=1  and p.Check_Token is not null and p.Check_Token != "" and c.Check_Token is not null and c.Check_Token != "" and p.status=1); -- pending approved     
  SET VisitUser = (SELECT COUNT(*) FROM Visitor_entry v    
   inner join Users u on u.User_Id = v.Visited_Employee_Id    
   inner join Company c on c.Company_Id= v.Company_Id  
   where cast(v.Visitor_Entry_Date as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') 
   and  u.User_Id = UserId and v.Plant_Id=PlantId  and v.Status=75  and c.Status=1);-- user based visitor    
  set InsideVisitor = (select COUNT(*) from Visitor_Entry_Log vl    
   inner join Visitor_Entry ve on ve.Visitor_Entry_Code= vl.Visitor_Entry_Code    
   inner join Company c on c.Company_Id= ve.Company_Id  
   where cast(Visitor_Entry_Date as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') 
   and  vl.Checked_Out is  null and vl.Checked_In is not null and ve.Plant_Id=PlantId and c.Status=1);    
    
  IF RoleId = 4 THEN -- SUPERVISOR
    SELECT
        Individual,
        Contractor,
        VehicleTripBased,
        GateActive,
        SecurityLoged,
        InsideVisitor;
    
		IF Header = 1 THEN
				SELECT
				Individual,
				checkedInCountAll AS checkedIn,
				checkedOutCountAll AS checkedOut,
				Contractor;
		END IF;

   ELSEIF RoleId = 5 THEN -- SECURITY
		SELECT
			Individual,
			Contractor,
			VehicleTripBased,
			checkedInCountAll AS checkedInAll,
			checkedOutCountAll AS checkedOutAll,
			InsideVisitor;
		
		IF Header = 1 THEN
			SELECT
				Individual,
				checkedInCountAll AS checkedIn,
				checkedOutCountAll AS checkedOut,
				Contractor;
		END IF;

  ELSE -- all USER
		SELECT
			Individual,
			Contractor,
			VehicleTripBased,
			VisitUser,
			pendingApproval,
            checkedInCountAll AS checkedInAll,
			checkedOutCountAll AS checkedOutAll,
			InsideVisitor;
            
		
		IF Header = 1 THEN
			SELECT
				Individual,
				checkedInCountAll AS checkedIn,
				checkedOutCountAll AS checkedOut,
				Contractor;
		END IF;

	END IF;

 -- select      
 -- Individual Individual,       
 -- Contractor Contractor,     
 -- InvoiceBased InvoiceBased,    
 -- VehicleTripBased VehicleTripBased,    
 -- checkedInCount  checkedIn ,      
 -- checkedOutCount checkedOut,    
 -- approved approved,    
 -- pendingApproval pendingApproval,    
 -- VisitUser VisitUser,    
 -- GateActive GateActive,    
 -- SecurityLoged SecurityLoged    
    
  -- No. of Visitors / Contractors    
  DROP TEMPORARY TABLE IF EXISTS AllDays;
  DROP TEMPORARY TABLE IF EXISTS VisitorData;
  DROP TEMPORARY TABLE IF EXISTS ContractorData;
  DROP TEMPORARY TABLE IF EXISTS InvoiceData;
  DROP TEMPORARY TABLE IF EXISTS VehicleTripData;
  DROP TEMPORARY TABLE IF EXISTS  workpermitData;
    
    
-- CREATE TEMPORARY TABLE AllDays AS (
--     SELECT DAYNAME(CURRENT_DATE) AS DayOfWeek, CURRENT_DATE AS DateValue
--     UNION SELECT DAYNAME(DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY)), DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY)
--     UNION SELECT DAYNAME(DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY)), DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY)
--     UNION SELECT DAYNAME(DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY)), DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY)
--     UNION SELECT DAYNAME(DATE_ADD(CURRENT_DATE, INTERVAL 4 DAY)), DATE_ADD(CURRENT_DATE, INTERVAL 4 DAY)
--     UNION SELECT DAYNAME(DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY)), DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY)
--     UNION SELECT DAYNAME(DATE_ADD(CURRENT_DATE, INTERVAL 6 DAY)), DATE_ADD(CURRENT_DATE, INTERVAL 6 DAY)
--     UNION SELECT 'Count', null
-- );
-- Step 1: Create the temporary table
CREATE TEMPORARY TABLE AllDays (
    DayOfWeek VARCHAR(20),
    DateValue DATE
);

-- Step 2: Insert values using separate INSERT statements
INSERT INTO AllDays (DayOfWeek, DateValue)
    SELECT DAYNAME(CURRENT_DATE), CURRENT_DATE
    UNION ALL
    SELECT DAYNAME(DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY)), DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY)
    UNION ALL
    SELECT DAYNAME(DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY)), DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY)
    UNION ALL
    SELECT DAYNAME(DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY)), DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY)
    UNION ALL
    SELECT DAYNAME(DATE_ADD(CURRENT_DATE, INTERVAL 4 DAY)), DATE_ADD(CURRENT_DATE, INTERVAL 4 DAY)
    UNION ALL
    SELECT DAYNAME(DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY)), DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY)
    UNION ALL
    SELECT DAYNAME(DATE_ADD(CURRENT_DATE, INTERVAL 6 DAY)), DATE_ADD(CURRENT_DATE, INTERVAL 6 DAY)
    UNION ALL
    SELECT 'Count', null;

    CREATE TEMPORARY TABLE VisitorData (
    DayOfWeek VARCHAR(20),
    VisitorCount INT
	);
	CREATE TEMPORARY TABLE ContractorData (
    DayOfWeek VARCHAR(20),
    VisitorCount INT
	);
    CREATE TEMPORARY TABLE InvoiceData (
    DayOfWeek VARCHAR(20),
    VisitorCount INT
	);
    CREATE TEMPORARY TABLE VehicleTripData (
    DayOfWeek VARCHAR(20),
    VisitorCount INT
	);
	CREATE TEMPORARY TABLE workpermitData (
    DayOfWeek VARCHAR(20),
    VisitorCount INT
	);
    
SET VisCount = (
    SELECT COUNT(vl.Checked_In) AS VisitorCount
    FROM AllDays ad
    LEFT JOIN (
        SELECT vel.*
        FROM Visitor_Entry_Log vel
        INNER JOIN Visitor_Entry ve ON ve.Visitor_Entry_Code = vel.Visitor_Entry_Code
            AND ve.Visitor_Type_Id = 35 AND ve.Plant_Id = PlantId
    ) vl ON ad.DayOfWeek = DAYNAME(vl.Checked_In)
    AND DATE(vl.Checked_In) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')
    -- vl ON ad.DateValue = DATE(vl.Checked_In)
--     AND ad.DateValue BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 6 DAY)
);   
	 INSERT INTO VisitorData (DayOfWeek, VisitorCount)
SELECT ad.DayOfWeek, COUNT(vl.Checked_In) AS VisitorCount
FROM AllDays ad
LEFT JOIN (
    SELECT vel.*
    FROM Visitor_Entry_Log vel
    INNER JOIN Visitor_Entry ve ON ve.Visitor_Entry_Code = vel.Visitor_Entry_Code
        AND ve.Visitor_Type_Id = 35 AND ve.Plant_Id = PlantId
	 ) vl ON ad.DayOfWeek = DAYNAME(vl.Checked_In)
	AND DATE(vl.Checked_In) BETWEEN STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')
	GROUP BY ad.DayOfWeek;
-- ) vl ON ad.DateValue = DATE(vl.Checked_In)
-- AND ad.DateValue BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 6 DAY)
-- GROUP BY ad.DayOfWeek;
     
UPDATE VisitorData 
SET 
    VisitorCount = VisCount
WHERE
    DayOfWeek = 'Count';
		
	 set ConCount =(    
	  SELECT    
	  COUNT(vl.Checked_In) AS VisitorCount    
	  FROM AllDays ad    
	  LEFT JOIN (    
	  select vel.* from Visitor_Entry_Log vel    
	  inner join Visitor_Entry ve on ve.Visitor_Entry_Code=vel.Visitor_Entry_Code and ve.Visitor_Type_Id=36 and ve.Plant_Id=PlantId    
	  ) vl ON ad.DayOfWeek = DAYNAME(vl.Checked_In)
        AND DATE(vl.Checked_In) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')
      -- vl ON ad.DayOfWeek = DATE_FORMAT(vl.Checked_In, '%a')   
-- 	  AND date(vl.Checked_In) BETWEEN STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  AND STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')    
	 );    
	  INSERT INTO ContractorData (DayOfWeek, VisitorCount)
	 SELECT    
	 ad.DayOfWeek,    
	 COUNT(vl.Checked_In) AS VisitorCount    
	 -- into ContractorData    
	 FROM AllDays ad    
	 LEFT JOIN (    
	 select vel.* from Visitor_Entry_Log vel    
	 inner join Visitor_Entry ve on ve.Visitor_Entry_Code=vel.Visitor_Entry_Code and ve.Visitor_Type_Id=36 and ve.Plant_Id=PlantId    
      ) vl ON ad.DayOfWeek = DAYNAME(vl.Checked_In)
	AND DATE(vl.Checked_In) BETWEEN STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')
	GROUP BY ad.DayOfWeek;
	 -- ) vl ON ad.DayOfWeek = DATE_FORMAT(vl.Checked_In, '%a')  
-- 	 AND date(vl.Checked_In) BETWEEN STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  AND STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')    
-- 	 GROUP BY ad.DayOfWeek  ;
     
	UPDATE ContractorData 
SET 
    VisitorCount = ConCount
WHERE
    DayOfWeek = 'Count';   
		
	 set InvoiceCount =(    
	  SELECT    
	  COUNT(ve.Created_On) AS VisitorCount    
	  FROM AllDays ad    
	  LEFT JOIN     
	  Visitor_Entry ve on  ve.Visitor_Type_Id=65 and ve.Plant_Id=PlantId and ad.DayOfWeek = DATE_FORMAT(ve.Created_On, '%a') 
	  AND date(ve.Created_On)  BETWEEN STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  AND STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')    
	 );    
	  INSERT INTO InvoiceData (DayOfWeek, VisitorCount)
	 SELECT    
	 ad.DayOfWeek,    
	 COUNT(ve.Created_On) AS VisitorCount    
	-- into InvoiceData    
	 FROM AllDays ad    
	 LEFT JOIN     
	  Visitor_Entry ve on  ve.Visitor_Type_Id=65 and ve.Plant_Id=PlantId and ad.DayOfWeek = DATE_FORMAT(ve.Created_On, '%a')   
	  AND date(ve.Created_On) BETWEEN  STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  AND STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')    
	 GROUP BY ad.DayOfWeek ;
     
	UPDATE InvoiceData 
SET 
    VisitorCount = InvoiceCount
WHERE
    DayOfWeek = 'Count';    
		
	 set VehicleTripCount =(    
	  SELECT    
	  COUNT(ve.Created_On) AS VisitorCount    
	  FROM  AllDays ad    
	  LEFT JOIN     
	  Visitor_Entry ve on  ve.Visitor_Type_Id=66 and ve.Plant_Id=PlantId and ad.DayOfWeek = DAYNAME(ve.Created_On)   
	  AND  date (ve.Created_On)  BETWEEN STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  AND STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')    
	 );   
	  INSERT INTO VehicleTripData (DayOfWeek, VisitorCount)
	 SELECT    
	 ad.DayOfWeek,    
	 COUNT(ve.Created_On) AS VisitorCount    
	 -- into  VehicleTripData    
	 FROM  AllDays ad    
	 LEFT JOIN     
	  Visitor_Entry ve on  ve.Visitor_Type_Id=66 and ve.Plant_Id=PlantId and ad.DayOfWeek = DAYNAME(ve.Created_On)   
	  AND date(ve.Created_On) BETWEEN STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  AND STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')    
	 GROUP BY ad.DayOfWeek;
     
--      SET ColumnList = (
--     SELECT GROUP_CONCAT(DISTINCT CONCAT('SUM(CASE WHEN DayOfWeek = ', QUOTE(DayOfWeek), ' THEN VisitorCount ELSE 0 END) AS ', QUOTE(DayOfWeek))) 
--     FROM AllDays
-- );

	  SET ColumnList = (
        SELECT GROUP_CONCAT(
            DISTINCT CONCAT(
                'SUM(CASE WHEN DayOfWeek = ', QUOTE(DayOfWeek), ' THEN VisitorCount ELSE 0 END) AS ', QUOTE(DayOfWeek)
            )
            ORDER BY CASE DayOfWeek                
                WHEN 'Sunday' THEN 1
                WHEN 'Monday' THEN 2
                WHEN 'Tuesday' THEN 3
                WHEN 'Wednesday' THEN 4
                WHEN 'Thursday' THEN 5
                WHEN 'Friday' THEN 6
                WHEN 'Saturday' THEN 7
                WHEN 'Count' THEN 8
                ELSE 9
            END
        )
        FROM AllDays
    );
    
	UPDATE VehicleTripData 
SET 
    VisitorCount = VehicleTripCount
WHERE
    DayOfWeek = 'Count';    
    
    SET workpermitCount = (
    SELECT COUNT(vl.Checked_In) AS VisitorCount
    FROM AllDays ad
    LEFT JOIN (
        SELECT vel.*
        FROM Visitor_Entry_Log vel
        INNER JOIN Visitor_Entry ve ON ve.Visitor_Entry_Code = vel.Visitor_Entry_Code
            AND ve.Visitor_Type_Id = 117 AND ve.Plant_Id = PlantId
    ) vl ON ad.DateValue = DATE(vl.Checked_In)
    AND ad.DateValue BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 6 DAY)
);   

	 INSERT INTO workpermitData (DayOfWeek, VisitorCount)
		SELECT ad.DayOfWeek, COUNT(vl.Checked_In) AS VisitorCount
		FROM AllDays ad
		LEFT JOIN (
			SELECT vel.*
			FROM Visitor_Entry_Log vel
			INNER JOIN Visitor_Entry ve ON ve.Visitor_Entry_Code = vel.Visitor_Entry_Code
				AND ve.Visitor_Type_Id = 117 AND ve.Plant_Id = PlantId
		) vl ON ad.DateValue = DATE(vl.Checked_In)
		AND ad.DateValue BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 6 DAY)
		GROUP BY ad.DayOfWeek;
			 
		UPDATE workpermitData 
SET 
    VisitorCount = workpermitCount
WHERE
    DayOfWeek = 'Count';
    
--     select*from VisitorData;
--     select*from ContractorData;
--     select*from InvoiceData;
--     select*from VehicleTripData;
--     select*from workpermitData;

			SET @SqlQuery1 = CONCAT('
				SELECT 
					', ColumnList, '
				FROM VisitorData'
			);
			SET @SqlQuery2 = CONCAT('
				SELECT 
					', ColumnList, '
				FROM ContractorData'
			);		
			SET @SqlQuery3 = CONCAT('
				SELECT 
					', ColumnList, '
				FROM InvoiceData'
			);		
			SET @SqlQuery4 = CONCAT('
				SELECT 
					', ColumnList, '
				FROM VehicleTripData'
			);    
			SET @SqlQuery5 = CONCAT('
				SELECT 
					', ColumnList, '
				FROM workpermitData'
			);   
	 PREPARE stmt1 FROM @SqlQuery1;
	 PREPARE stmt2 FROM @SqlQuery2;
	 PREPARE stmt3 FROM @SqlQuery3;
	 PREPARE stmt4 FROM @SqlQuery4;
	 PREPARE stmt5 FROM @SqlQuery5;
	 EXECUTE stmt1;
	 EXECUTE stmt2;
	 EXECUTE stmt3;
	 EXECUTE stmt4;
	 EXECUTE stmt5;
	 DEALLOCATE PREPARE stmt1; 
	 DEALLOCATE PREPARE stmt2; 
	 DEALLOCATE PREPARE stmt3; 
	 DEALLOCATE PREPARE stmt4; 
	 DEALLOCATE PREPARE stmt5; 
    
 -- Purpose of Visit    
 -- Total int    
    
	 set AuditingInspection= (select COUNT(*) from Visitor_Entry v where Purpose_Of_Visit=78 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')  and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code));      
	 set AttendingInterview= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=79 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code));    
	 set ContractorTemporaryWork= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=80 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code));    
	 set CustomerSupplierMeeting= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=81 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code));    
	 set ClientPartnerMeeting= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=82 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code));    
	 set DeliveryPickup= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=83 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code));    
	 set TrainingWorkshop= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=84 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code));    
	 set ServiceMaintenance= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=85 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code));    
	 set SalesPresentation= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=86 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code)) ;   
	 set Tour= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=87 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code));    
	 set Meeting= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=88 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code));    
	 set PersonalVisit= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=89 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code)) ;   
	 set GovernmentOfficials= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=90 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code)) ;   
	 set Consultation= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=91 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code)) ;   
	 set EmergencyResponse= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=92 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code));    
	 set WorkPermit= (select COUNT(*) from Visitor_Entry v where Purpose_Of_Visit=118 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')  and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code));      
     set Others= (select COUNT(*) from visitor_Entry v where Purpose_Of_Visit=93 and Plant_Id=PlantId and date(Visitor_Entry_Date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s') and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')  and exists(select*from Visitor_Entry_Log vl where v.Visitor_Entry_Code= vl.Visitor_Entry_Code));
	 -- set Total= (AuditingInspection+AttendingInterview+ContractorTemporaryWork+CustomerSupplierMeeting+    
	SELECT 
    AuditingInspection `Auditing/Inspection`,
    AttendingInterview AttendingInterview,
    TrainingWorkshop `Training/Workshop`,
    ServiceMaintenance `Service/Maintenance`,
    Meeting Meeting,
    WorkPermit WorkPermit,
    Others Others;  
		-- select Total    
 end  if;  
    
if(Type='DashboardOnclick')        
then      
  DROP TEMPORARY TABLE IF EXISTS IndividualOnclick;
  DROP TEMPORARY TABLE IF EXISTS ContractorOnclick;
  DROP TEMPORARY TABLE IF EXISTS checkedInCountOnclick;
  DROP TEMPORARY TABLE IF EXISTS checkedOutCountOnclick;
  DROP TEMPORARY TABLE IF EXISTS InvoiceBasedOnclick;
  DROP TEMPORARY TABLE IF EXISTS VehicleTripBasedOnclick;
  DROP TEMPORARY TABLE IF EXISTS approvedOnclick;
  DROP TEMPORARY TABLE IF EXISTS pendingApprovalOnclick;
  DROP TEMPORARY TABLE IF EXISTS VisitUserOnclick;
  DROP TEMPORARY TABLE IF EXISTS GateActiveOnclick;
  DROP TEMPORARY TABLE IF EXISTS SecurityLogedOnclick;
  DROP TEMPORARY TABLE IF EXISTS InsideVisitorOnclick;
  DROP TEMPORARY TABLE IF EXISTS checkedInCountAllOnclick;
  DROP TEMPORARY TABLE IF EXISTS checkedOutCountAllOnclick;

 create temporary table IndividualOnclick ( -- Visitor_Code varchar(50), 
	Visitor_Name varchar(100) ,Mobile_No varchar(50),Company_Name varchar(100));    
 create temporary table ContractorOnclick (-- Visitor_Code varchar(50), 
	Contractor_Name varchar(100),Mobile_No varchar(50),Company_Name varchar(100));    
 create temporary table checkedInCountOnclick (Visitor_Code varchar(50),Visitor_Name varchar(100),Mobile_No varchar(50),Mail_Id varchar(50),Purpose_Of_Visit varchar(30),Checked_In varchar(100) );    
 create temporary table checkedOutCountOnclick (Visitor_Code varchar(50),Visitor_Name varchar(100),Mobile_No varchar(50),Mail_Id varchar(50),Purpose_Of_Visit varchar(30),Checked_In varchar(100),Checked_Out varchar(100));    
 create temporary table InvoiceBasedOnclick (Visitor_Entry_Code varchar(50), Invoice_Number varchar(100)) ;   
 create temporary table VehicleTripBasedOnclick (Visitor_Entry_Code varchar(50),Vehicle_No varchar(50),Vehicle_Model varchar(50) );    
 create temporary table approvedOnclick (Document_No varchar(50),Whom_To_Visit varchar(100),Visitor_Name varchar(100),Status varchar(20));    
 create temporary table pendingApprovalOnclick (Document_No varchar(50),Whom_To_Visit varchar(100),Visitor_Name varchar(100),Status varchar(20));    
 create temporary table VisitUserOnclick (Visitor_Name varchar(50), Mobile_No varchar(50),Purpose_Of_Visit varchar(50),Visit_Time varchar(50),Status varchar(50));    
 create temporary table GateActiveOnclick (Gate_Name varchar(100),Gate_Incharge_Name varchar(50),Gate_Open_Time varchar(30)) ;   
 create temporary table SecurityLogedOnclick (Security_Name varchar(50) ,Gate_name varchar(20) ,Log_In varchar(50));    
 create temporary table InsideVisitorOnclick (Person_Name varchar(50),Visitor_Type varchar(50),Mobile_No varchar(50),Purpose_Of_Visit varchar(50),-- Visitor_Company varchar(50),
 Checked_In varchar(50)) ;   
 create temporary table checkedInCountAllOnclick (Visitor_Code varchar(50),Visitor_Name varchar(100),Mobile_No varchar(50),Mail_Id varchar(50),Purpose_Of_Visit varchar(30),Checked_In varchar(100));    
 create temporary table checkedOutCountAllOnclick (Visitor_Code varchar(50),Visitor_Name varchar(100),Mobile_No varchar(50),Mail_Id varchar(50),Purpose_Of_Visit varchar(30),Checked_In varchar(100),Checked_Out varchar(100)) ;   
    
 insert into IndividualOnclick select         
  ved.First_name,  
  -- v.Visitor_Code ,  
  ved.Mobile_No,     
  c.Company_Name   
  from Visitor_Entry_Detail ved
  inner join  visitor_entry ve on ve.Visitor_Entry_Id = ved.Visitor_Entry_Id
 -- INNER JOIN Visitor v ON ve.Visitor_Id = v.Visitor_Id     
  inner join Company c on  c.Company_Id = ve.Company_Id    
  where
  cast(Visitor_Entry_Date as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s')  and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and 
  ve.Visitor_Type_Id=35  and ve.Plant_Id=PlantId and c.Status=1  and ve.Status = 75;   
  
  
 insert into ContractorOnclick select     
 -- v.Visitor_Code ,    
  ved.First_Name,     
  ved.Mobile_No ,    
  c.Company_Name     
  from Visitor_Entry_Detail ved
  inner join  visitor_entry ve on ve.Visitor_Entry_Id = ved.Visitor_Entry_Id  
  -- INNER JOIN Visitor v ON ve.Visitor_Id = v.Visitor_Id     
  inner join Company c on  c.Company_Id = ve.Company_Id    
  where cast(Visitor_Entry_Date as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s') and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') 
  and  ve.Visitor_Type_Id=36  and ve.Plant_Id=PlantId and c.Status=1 and ve.Status = 75;  
 
 insert into checkedInCountOnclick select       
  ved.Visitor_Entry_Detail_Code,CONCAT(ved.First_Name, ' ', ved.Last_Name),ved.Mobile_No,ved.Mail_Id,m.Meta_Sub_Description,vl.Checked_In    
  from Visitor_Entry_Log vl     
  inner join Visitor_Entry ve on ve.Visitor_Entry_Code = vl.Visitor_Entry_Code  
  inner join visitor_entry_detail ved on ved.Visitor_Entry_Detail_Id= vl.Visitor_Entry_Detail_Id
 -- INNER JOIN Visitor v ON ve.Visitor_Id = v.Visitor_Id     
  inner join Metadata m on m.Meta_Sub_Id = ve.Purpose_Of_Visit    
  inner join Company c on c.Company_Id= ve.Company_Id  
  where cast(Checked_In as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s') and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') 
  and ve.Plant_Id=PlantId and ve.Visited_Employee_Id=UserId and c.Status=1  ;
 
 insert into checkedOutCountOnclick select     
  ved.Visitor_Entry_Detail_Code,CONCAT(ved.First_Name, ' ', ved.Last_Name),ved.Mobile_No,ved.Mail_Id,m.Meta_Sub_Description,vl.Checked_In,vl.Checked_Out    
  from Visitor_Entry_Log vl     
  inner join Visitor_Entry ve on ve.Visitor_Entry_Code = vl.Visitor_Entry_Code  
  inner join visitor_entry_detail ved on ved.Visitor_Entry_Detail_Id= vl.Visitor_Entry_Detail_Id   
  INNER JOIN Visitor v ON ve.Visitor_Id = v.Visitor_Id     
  inner join Metadata m on m.Meta_Sub_Id = ve.Purpose_Of_Visit    
  inner join Company c on c.Company_Id= ve.Company_Id   
  where cast(Checked_Out as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s') and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and ve.Plant_Id=PlantId and ve.Visited_Employee_Id=UserId  and c.Status=1  ;
 
 insert into InvoiceBasedOnclick select Visitor_Entry_Code,Invoice_Number    
  from Visitor_Entry ve     
  inner join Company c on c.Company_Id= ve.Company_Id  
  where cast(Visitor_Entry_Date as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s') and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and  ve.Visitor_Type_Id=65  and ve.Plant_Id=PlantId  and c.Status=1 ;
 
 insert into VehicleTripBasedOnclick select     
  ve.Visitor_Entry_Code,ve.Vehicle_No, IFnull(v.Vehicle_Model, '-') AS Vehicle_Model
  from Visitor_Entry ve  
  left join Vehicle v on v.Vehicle_No = ve.Vehicle_No
  inner join Company c on c.Company_Id= ve.Company_Id  
  where cast(Visitor_Entry_Date as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s') and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s')
  and  ve.Visitor_Type_Id=66 and ve.Plant_Id=PlantId  and c.Status=1  ;

 insert into approvedOnclick 
select 
  VE.Visitor_Entry_Code as Document_No, 
  U.User_Name,
  ve.Person_Name,
  m.Meta_Sub_Description  
  
  from Visitor_Entry VE
  inner join Users U on U.User_Id = UserId
  inner join plant P on P.Plant_Id = VE.Plant_Id
  inner join Company C on C.Company_Id = VE.Company_Id
  inner join Metadata m on m.Meta_Sub_Id = VE.Status
  
  WHERE 
  DATE(VE.Visitor_Entry_Date) BETWEEN DATE(FDate) AND DATE(TDate) and VE.Visitor_Type_Id in (35,36)
  and  VE.Plant_Id = PlantId and ( VE.Visited_Employee_Id = UserId ) 
  and VE.Status = 75 
  and C.Company_Id = CompanyId
  and c.Status=1 and p.Check_Token is not null and p.Check_Token != "" and c.Check_Token is not null and c.Check_Token != "" and p.status=1;

 insert into pendingApprovalOnclick select     
  ad.Document_No, uv.User_Name,ve.Person_Name,m.Meta_Sub_Description    
  FROM Approval_Detail ad      
  inner join Approval a on a.Approval_Id =ad.Approval_Id      
  inner join users u on u.User_Id = UserId     
  inner join users ui on ui.User_Id =a.Created_By     
  inner join plant p on p.Plant_Id= a.Plant_Id       
  inner join Visitor_Entry ve on ve.Visitor_Entry_Code = ad.Document_No    
  inner join Users uv on uv.User_Id = ad.Primary_User_Id    
  inner join Metadata m on m.Meta_Sub_Id = ad.Status    
  inner join Company c on c.Company_Id= ve.Company_Id  
  where date(ifnull(ad.Modified_On,ad.Created_On)) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s') and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') 
  and  a.Plant_Id = PlantId and (ad.Primary_User_Id=UserId or ad.Secondary_User_Id=UserId) and a.Status = 74  and c.Status=1  and p.Check_Token is not null and p.Check_Token != "" and c.Check_Token is not null and c.Check_Token != "" and p.status=1;

 insert into VisitUserOnclick select     
  v.Person_Name, v.Mobile_No,m.Meta_Sub_Description,v.Valid_From,ms.Meta_Sub_Description    
  from Visitor_Entry v    
  inner join Users u on u.User_Id = v.Visited_Employee_Id    
  inner join Metadata m on m.Meta_Sub_Id = v.Purpose_Of_Visit    
  inner join Metadata ms on ms.Meta_Sub_Id = v.Status    
  inner join Company c on c.Company_Id= v.Company_Id  
  where cast(Visitor_Entry_Date as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s') and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') 
  and  u.User_Id = UserId and v.Plant_Id=PlantId   and v.Status=75  and c.Status=1  ;

 insert into GateActiveOnclick select     
  g.Gate_Name ,u.User_Name,g.Gate_Open_Time    
  from Gate g     
  inner join Users u on u.User_Id = g.Gate_Incharge_id    
  inner join Company c on c.Company_Id= g.Company_Id  
  where cast(g.Created_On as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s') and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and  g.Status=1 and g.Plant_Id=PlantId and c.Status=1 ;

 insert into SecurityLogedOnclick select     
  (u.User_Name) ,g.Gate_Name, us.Logged_In_On    
  from User_Session us     
  inner join Users u on u.User_Id = us.Logged_User    
  inner join Gate g on g.Gate_Id = u.Gate_Id    
  inner join Company c on c.Company_Id= u.Company_Id  
  WHERE cast(us.Logged_In_On as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s') and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and  date(us.Logged_In_On) = curdate() and us.Logged_Role=5 and us.Plant_Id=PlantId and c.Status=1;      
 
 insert into InsideVisitorOnclick  select      
  ved.First_Name ,m.Meta_Sub_Description,ved.Mobile_No,m1.Meta_Sub_Description,
  -- v.Visitor_Company,
  vl.Checked_In    
  from Visitor_Entry_Log vl    
  inner join Visitor_Entry ve on ve.Visitor_Entry_Code = vl.Visitor_Entry_Code  
  inner join visitor_entry_detail ved on ved.Visitor_Entry_Detail_Id = vl.Visitor_Entry_Detail_Id
 -- inner join Visitor v on v.Visitor_Id = ve.Visitor_Id    
  inner join Metadata m on m.Meta_Sub_Id = ve.Visitor_Type_Id    
  inner join Metadata m1 on m1.Meta_Sub_Id = ve.Purpose_Of_Visit    
  inner join Company c on c.Company_Id= ve.Company_Id  
  where cast(Visitor_Entry_Date as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s') and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and  Checked_Out is  null and Checked_In is not null and ve.Plant_Id=PlantId  and c.Status=1 ;    
 
 insert into checkedInCountAllOnclick select     
  ved.Visitor_Entry_Detail_Code,CONCAT(ved.First_Name, ' ', ved.Last_Name) ,ved.Mobile_No,ved.Mail_Id,m.Meta_Sub_Description,vl.Checked_In    
  from Visitor_Entry_Log vl     
  inner join Visitor_Entry ve on ve.Visitor_Entry_Code = vl.Visitor_Entry_Code     
  -- INNER JOIN Visitor v ON ve.Visitor_Id = v.Visitor_Id     
  inner join visitor_entry_detail ved on ved.Visitor_Entry_Detail_Id= vl.Visitor_Entry_Detail_Id
  inner join Metadata m on m.Meta_Sub_Id = ve.Purpose_Of_Visit   
  inner join Company c on c.Company_Id= ve.Company_Id  
  where cast(Checked_In as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s') and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and ve.Plant_Id=PlantId   and c.Status=1  ;

 insert into checkedOutCountAllOnclick select     
  ved.Visitor_Entry_Detail_Code,CONCAT(ved.First_Name, ' ', ved.Last_Name) ,ved.Mobile_No,ved.Mail_Id,m.Meta_Sub_Description,vl.Checked_In,vl.Checked_Out    
  from Visitor_Entry_Log vl     
  inner join Visitor_Entry ve on ve.Visitor_Entry_Code = vl.Visitor_Entry_Code  
  inner join visitor_entry_detail ved on ved.Visitor_Entry_Detail_Id= vl.Visitor_Entry_Detail_Id   
  -- INNER JOIN Visitor v ON ve.Visitor_Id = v.Visitor_Id     
  inner join Metadata m on m.Meta_Sub_Id = ve.Purpose_Of_Visit   
  inner join Company c on c.Company_Id= ve.Company_Id  
  where cast(Checked_Out as date) between STR_TO_DATE(FDate, '%Y-%m-%d %H:%i:%s') and STR_TO_DATE(TDate, '%Y-%m-%d %H:%i:%s') and ve.Plant_Id=PlantId and c.Status=1;    
	
    IF StsId = 77 THEN
    SELECT * FROM IndividualOnclick;
    
	ELSEIF StsId = 78 THEN
		SELECT * FROM ContractorOnclick;
		
	ELSEIF StsId = 79 THEN
		SELECT * FROM checkedInCountOnclick;
		
	ELSEIF StsId = 80 THEN
		SELECT * FROM checkedOutCountOnclick;
		
	ELSEIF StsId = 81 THEN
		SELECT * FROM GateActiveOnclick;
		
	ELSEIF StsId = 82 THEN
		SELECT * FROM InvoiceBasedOnclick;
		
	ELSEIF StsId = 83 THEN
		SELECT * FROM SecurityLogedOnclick;
		
	ELSEIF StsId = 84 THEN
		SELECT * FROM VehicleTripBasedOnclick;
		
	ELSEIF StsId = 85 THEN
		SELECT * FROM VisitUserOnclick;
		
	ELSEIF StsId = 86 THEN
		SELECT * FROM approvedOnclick;
		
	ELSEIF StsId = 87 THEN
		SELECT * FROM pendingApprovalOnclick;
		
	ELSEIF StsId = 88 THEN
		SELECT * FROM InsideVisitorOnclick;
		
	ELSEIF StsId = 89 THEN
		SELECT * FROM checkedInCountAllOnclick;
		
	ELSEIF StsId = 90 THEN
		SELECT * FROM checkedOutCountAllOnclick;
		
	END IF;
 
END IF;
END //
DELIMITER ;