DELIMITER //
DROP PROCEDURE IF EXISTS SP_BRANCH_CI;
CREATE PROCEDURE SP_BRANCH_CI  
(  
	IN Type varchar(100),
	IN Branchid int   
)
BEGIN    
if(Type='CreateInitialize')    
THEN
   select * from Branch_Master   where status=1;    
     
 if(Branchid >0)    
 THEN
 select * from Branch_Master where  Branchid=@Branchid;    
 end IF;   
end IF;   
if(Type='SearchInitialize')    
THEN    
select * from Branch_Master where status=1;    
end IF;   
END  //

DELIMITER ;
