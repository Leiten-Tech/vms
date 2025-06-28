
DELIMITER //
DROP PROCEDURE IF EXISTS SP_HOME_INITIALIZE;
CREATE PROCEDURE SP_HOME_INITIALIZE (
    IN Userid BIGINT,
    IN roleid BIGINT,
    IN companyid BIGINT
)
BEGIN
	DECLARE username VARCHAR(100);
    DECLARE rolename VARCHAR(100);
    DECLARE plantname VARCHAR(100);
    DECLARE defplantid INT;
    DECLARE defcompanyid INT;
    DECLARE defroleid INT;
    

    DROP TEMPORARY TABLE IF EXISTS usercompanymap;
    DROP TEMPORARY TABLE IF EXISTS userplantmap;
    DROP TEMPORARY TABLE IF EXISTS userrolemap;
    DROP TEMPORARY TABLE IF EXISTS usergatemap;
    DROP TEMPORARY TABLE IF EXISTS screens;
    DROP TEMPORARY TABLE IF EXISTS Final_screens;

    CREATE TEMPORARY TABLE usercompanymap (
        CompanyId BIGINT,
        CompanyName VARCHAR(100),
        CheckToken longtext,
        IsDefault BOOLEAN
    );

    INSERT INTO usercompanymap (CompanyId, CompanyName, IsDefault, CheckToken)
    SELECT
        uc.Company_Id,
        c.Company_Name,
        uc.Is_Default,
        c.Check_Token
    FROM
        User_Company_Map uc
    INNER JOIN
        User_Plant_Map ubm ON ubm.User_Id = uc.User_Id AND ubm.company_id = uc.Company_Id
    INNER JOIN
        Company c ON c.Company_Id = uc.Company_Id and c.Check_Token is not null and c.Check_Token != "" AND c.Status = 1
    WHERE
        uc.User_Id = Userid
    GROUP BY
        uc.Company_Id,
        c.Company_Name,
        uc.Is_Default,
        c.Check_Token;

	SELECT CompanyId INTO defcompanyid
	FROM usercompanymap
	WHERE IsDefault = 1;
   
    CREATE TEMPORARY TABLE userplantmap (
        PlantId BIGINT,
        PlantName VARCHAR(100),
        IsDefault BOOLEAN
    );

    INSERT INTO userplantmap (PlantId, PlantName, IsDefault)
    SELECT
        ubm.Plant_Id,
        p.Plant_Name,
        ubm.Is_Default
    FROM
        User_Plant_Map ubm
    INNER JOIN
        Plant p ON p.Plant_Id = ubm.Plant_Id and p.Check_Token is not null and p.check_Token != ""
    WHERE
        ubm.User_Id = Userid AND ubm.company_id = defcompanyid AND ubm.status = 1;

    CREATE TEMPORARY TABLE userrolemap (
        role_id BIGINT,
        role_name VARCHAR(100),
        Is_Default BOOLEAN
    );

    INSERT INTO userrolemap (role_id, role_name, Is_Default)
    SELECT
        urm.role_id,
        ro.role_name,
        urm.Is_Default
    FROM
        User_Role_Map urm
    INNER JOIN
        role ro ON ro.role_id = urm.role_id AND ro.Status = urm.status
    WHERE
        urm.User_Id = Userid AND urm.Status = 1;

    CREATE TEMPORARY TABLE usergatemap (
        GateId BIGINT,
        GateName VARCHAR(100),
        IsDefault BOOLEAN
    );

    INSERT INTO usergatemap (GateId, GateName, IsDefault)
    SELECT
        ugm.Gate_Id,
        g.Gate_Name,
        ugm.Is_Default
    FROM
        User_Gate_Map ugm
    INNER JOIN
        Gate g ON g.Gate_Id = ugm.Gate_Id
    WHERE
        ugm.User_Id = Userid AND ugm.company_id = defcompanyid AND ugm.status = 1;

    CREATE TEMPORARY TABLE screens AS
    SELECT
        fn_parent.Parent_Id AS topmostparentid,
        fn_parent.Function_Id AS parentid,
        fn_parent.Function_Name AS parentscreenname,
        fn_parent.status AS parentstatus,
        fn_childscreen.Screen_Order,
        fn_childscreen.Function_Id AS childscreenid,
        fn_childscreen.Function_Name AS childscreenname,
        fn_childscreen.Function_Url AS childscreenurl,
        u.User_id,
        urm.role_id,
        fn_parent.rel_link,
        fn_parent.menu_icon,
        usrm.Create AS create_permission,
        usrm.Update AS update_permission,
        usrm.Delete AS delete_permission,
        usrm.View AS view_permission,
        usrm.Print AS print_permission,
        usrm.Approval AS approval_permission
    FROM
        `function` fn_parent
    INNER JOIN
        `function` fn_childscreen ON fn_childscreen.parent_id = fn_parent.Function_Id AND fn_childscreen.Status = fn_parent.status
    INNER JOIN
        User_Screen_Mapping usrm ON usrm.Screen_Id = fn_childscreen.Function_Id AND fn_childscreen.Status = usrm.status
    INNER JOIN
        User_Role_Map urm ON usrm.role_id = urm.role_id AND urm.User_id = usrm.User_id AND usrm.Status = urm.status
    INNER JOIN
        users u ON u.User_id = urm.User_id AND u.Status = urm.status
    WHERE
        fn_childscreen.Status = 1;

    CREATE TEMPORARY TABLE Final_screens AS
    SELECT
        scr.topmostparentid,
        scr.parentid,
        scr.parentscreenname,
        scr.parentstatus,
        scr.Screen_Order,
        scr.childscreenid,
        scr.childscreenname,
        scr.childscreenurl,
        scr.User_id,
        scr.role_id,
        scr.rel_link,
        scr.menu_icon,
        scr.create_permission,
        scr.update_permission,
        scr.delete_permission,
        scr.view_permission,
        scr.print_permission,
        scr.approval_permission
    FROM
        screens scr
    WHERE
        scr.User_id = Userid AND scr.role_id = roleid;

    -- Final Selects
    SELECT * FROM usercompanymap;
    SELECT * FROM userplantmap;
    SELECT * FROM userrolemap;
    SELECT * FROM usergatemap;

    -- Get modules
    SELECT
        scr.parentid,
        scr.parentscreenname,
        scr.parentstatus,
        scr.rel_link,
        scr.menu_icon,
        C.Screen_Order AS ScreenOrder
    FROM
        Final_screens scr
    INNER JOIN
        `function` C ON C.Function_Id = scr.parentid
    WHERE
        topmostparentid = 0
    GROUP BY
        scr.parentid,
        scr.parentscreenname,
        scr.parentstatus,
        scr.rel_link,
        scr.menu_icon,
        C.Screen_Order
    ORDER BY
        C.Screen_Order;

    SELECT * FROM Final_screens ORDER BY parentid, Screen_Order ASC;
END //
DELIMITER ;

