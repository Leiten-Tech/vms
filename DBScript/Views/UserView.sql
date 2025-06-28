CREATE OR REPLACE VIEW User_View AS
SELECT
    u.User_Id,
    u.User_Name,
    u.Password,
    u.Company_Id,
    u.Plant_Id,
    u.Default_Role_Id,
    u.User_Email,
    u.User_Tel_No,
    u.Status,
    u.Created_By,
    u.Created_On,
    u.Modified_By,
    u.Modified_On,
    -- ur.role_id defaultroleid,
    rm.Role_Name defaultrolename,
    ub.Plant_Id isdefaultbranchid,
    bm.Plant_Name isdefaultbranchname,
    IFNULL(u.Plant_Id, 0) AS currentbranchid,
    IFNULL(bm1.Plant_Name, '') AS currentbranchname,
    m.status AS statusname,
    u.status AS statusid
FROM
    Users u
INNER JOIN user_role_map ur ON ur.User_Id = u.User_Id
INNER JOIN user_branch_map ub ON ub.User_Id = u.User_Id
INNER JOIN Role rm ON rm.Role_Id = ur.Role_Id AND ur.Is_Default = 1
INNER JOIN Plant bm ON bm.Plant_Id = ub.Plant_Id AND ub.Is_Default = 1
INNER JOIN metadata m ON m.Meta_Sub_Id = u.Status
LEFT JOIN Plant bm1 ON bm1.Plant_Id = u.Plant_Id;
