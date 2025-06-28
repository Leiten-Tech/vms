CREATE OR REPLACE VIEW User_Plant_Map_View AS  
SELECT 
    u.User_Id,
    u.User_Name,
    p.Plant_Id,
    p.Plant_Name,
    up.Is_Default,
    u.Status
FROM 
    Users u
INNER JOIN 
    User_Plant_Map up ON up.User_Id = u.User_Id
INNER JOIN 
    Plant p ON p.Plant_Id = up.Plant_Id;
