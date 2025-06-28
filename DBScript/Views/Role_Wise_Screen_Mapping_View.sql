CREATE OR REPLACE VIEW Role_Wise_Screen_Mapping_View AS            
SELECT 
    b.Role_Id, 
    a.Function_Id AS ScreenId,
    a.Function_Name AS ScreenName,
    a.Parent_Id AS ModuleId,
    IFNULL(aa.Function_Name, '') AS ModuleName
FROM 
    `function` a
INNER JOIN 
    `function` aa ON aa.Function_Id = a.Parent_Id
INNER JOIN 
    Function_Role_Map b ON a.Function_Id = b.Function_Id  
WHERE 
    a.Function_Status = 1
UNION
SELECT 
    0 AS ROLEID,
    a.Function_Id AS ScreenId,
    a.Function_Name AS SCREENNAME,
    a.Parent_Id AS MODULEID,
    aa.Function_Name AS MODULENAME
FROM 
    `FUNCTION` a
INNER JOIN 
    `FUNCTION` aa ON aa.Function_Id = a.Parent_Id  
WHERE 
    a.Function_Status = 1;
