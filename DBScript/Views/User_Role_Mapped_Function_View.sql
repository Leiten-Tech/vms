CREATE OR REPLACE VIEW User_Role_Mapped_Function_View AS
SELECT   
    UM.Role_Id,  
    RL.Role_Name,  
    UM.User_Id,  
    U.User_Name,  
    UM.CREATE,  
    UM.UPDATE,  
    UM.DELETE,  
    UM.VIEW,  
    UM.PRINT,  
    UM.APPROVAL,  
    0 AS PRICEHISTORY,  
    0 AS PROFIT,  
    0 AS SERIES,  
    FN.Parent_Id AS MODULEID,  
    F.Function_Name AS MODULENAME,  
    UM.Screen_Id,  
    FN.Function_Name AS SCREENNAME,  
    FN.Function_Url AS PATH,  
    FN.Screen_Order  
FROM   
    User_Screen_Mapping UM
INNER JOIN `function` F ON F.Function_Id = UM.Module_Id  
INNER JOIN `function` FN ON FN.Function_Id = UM.Screen_Id  
INNER JOIN USERS U ON U.User_Id = UM.User_Id  
INNER JOIN ROLE RL ON RL.Role_Id = UM.Role_Id  
INNER JOIN User_Role_Map URM ON URM.User_Id = U.User_Id AND URM.Role_Id = UM.Role_Id  
WHERE 
    FN.Status = 1
    -- and (FN_ISANYFUNCTION(UM.CREATE, UM.UPDATE, UM.DELETE, UM.VIEW, UM.PRINT, UM.APPROVAL) = 1)  
    AND FN.Is_External = 1;
