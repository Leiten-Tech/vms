CREATE OR REPLACE VIEW User_Role_Map_View AS  
SELECT 
    u.User_Id,
    u.User_Name,
    r.Role_Id,
    r.Role_Name,
    ur.Is_Default,
    u.Status
FROM 
    Users u
INNER JOIN 
    User_Role_Map ur ON ur.User_Id = u.User_Id 
INNER JOIN 
    Role r ON r.Role_Id = ur.Role_Id;
