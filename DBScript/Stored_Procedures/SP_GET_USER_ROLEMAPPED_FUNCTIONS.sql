DELIMITER //
DROP PROCEDURE IF EXISTS SP_GET_USER_ROLEMAPPED_FUNCTIONS;

CREATE PROCEDURE SP_GET_USER_ROLEMAPPED_FUNCTIONS(
    IN userid INT,
    IN roleid INT,
    IN moduleid VARCHAR(255)
)
BEGIN
        SELECT
        rl.Role_Id AS RoleId,
        rl.Role_Name AS RoleName,
        IFNULL(us.User_Id, '') AS UserId,
        IFNULL(us.User_Name, '') AS UserName,
        COALESCE(um.`create`, 0) AS `Create`,
        COALESCE(um.`update`, 0) AS `Update`,
        COALESCE(um.`delete`, 0) AS `Delete`,
        COALESCE(um.`view`, 0) AS `View`,
        COALESCE(um.`print`, 0) AS `Print`,
        COALESCE(um.approval, 0) AS Approval,
        f.Parent_Id AS ModuleId,
        COALESCE(parent_fn.Function_Name, f.Function_Name) AS ModuleName,
        fn.Function_Id AS ScreenId,
        fn.Function_Name AS ScreenName,
        fn.Function_Url AS `Path`,
        fn.Screen_Order AS ScreenOrder
    FROM
        `function` f
    INNER JOIN
        `function` fn ON fn.Function_Id = f.Function_Id AND f.status = 1
    LEFT JOIN
        `function` parent_fn ON parent_fn.Function_Id = f.Parent_Id AND f.Status = 1
    INNER JOIN
        Function_Role_Map rsm ON rsm.Function_Id = f.Function_Id AND rsm.Role_Id = roleid
    INNER JOIN
        Role rl ON rl.Role_Id = rsm.Role_Id
    LEFT JOIN
        User_Screen_Mapping um ON um.Screen_Id = fn.Function_Id AND um.role_id = rsm.Role_Id AND um.User_Id = userid
    LEFT JOIN
        Users us ON us.User_Id = um.User_Id
	WHERE 
    moduleid IS NULL OR moduleid = '0'
    OR FIND_IN_SET(f.Parent_Id, moduleid);
END//
DELIMITER ;
