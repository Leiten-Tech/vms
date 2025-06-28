DROP PROCEDURE IF EXISTS SP_GET_ROLEMAPPED_USERS;
DELIMITER //
CREATE PROCEDURE SP_GET_ROLEMAPPED_USERS(
    IN Roleid INT,
    IN PlantId BIGINT
)
BEGIN
    SELECT
        u.User_Id UserId,
        u.User_Name UserName,
        u.Company_Id CompanyId
    FROM
        User_Role_Map ur
    LEFT JOIN
        Users u ON u.User_Id = ur.User_Id
    WHERE
        ur.role_id = Roleid AND u.status = 1 AND u.Plant_Id = PlantId;
end//

DELIMITER ;