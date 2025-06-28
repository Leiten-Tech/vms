DELIMITER //
DROP PROCEDURE IF EXISTS SP_ROLE_CI;

CREATE PROCEDURE SP_ROLE_CI       
(
	IN Type VARCHAR(255),
	IN RoleId BIGINT,
    IN PlantId BIGINT
)
BEGIN      
    IF (Type = 'CreateInitialize') THEN      
        BEGIN      
            SELECT * FROM Metadata WHERE Meta_Type_Code = 'STA';
            IF (RoleId > 0) THEN
                SELECT * FROM Role WHERE Role_Id = RoleId;   
            END IF;
        END;
    ELSEIF (Type = 'SearchInitialize') THEN
        BEGIN      
            SELECT
                r.Role_Id AS RoleId,    
                r.Role_Code AS RoleCode,    
                r.Role_Name AS RoleName,
                c.Company_Id AS CompanyId,
                p.Plant_Id AS PlantId,
                r.Status AS Status,
                m.Meta_Sub_Description AS StatusName,
                r.Created_By AS CreatedBy,
                u.User_Name AS CreatedByName,
                DATE_FORMAT(r.Created_On, '%Y-%m-%d %H:%i:%s') AS CreatedOn,
                IFNULL(DATE_FORMAT(r.Modified_On, '%Y-%m-%d %H:%i:%s'), DATE_FORMAT(r.Created_On, '%Y-%m-%d %H:%i:%s')) AS ModifiedOn,
                COALESCE(u.User_Name, u1.User_Name) AS ModifiedByName,
                r.Modified_By AS ModifiedBy,
                r.Is_System_Generated IsSystemGenerated
            FROM
                Role r 
            INNER JOIN
                Company c ON c.Company_Id = r.Company_Id
            INNER JOIN
                Plant p ON p.Plant_Id = r.Plant_Id 
            INNER JOIN
                MetaData m ON m.Meta_Sub_Id = r.Status
            INNER JOIN
                Users u ON u.User_Id = r.Created_By
            LEFT JOIN
                Users u1 ON u1.User_Id = r.Modified_By
			WHERE 
				r.Plant_Id = PlantId and p.Check_Token is not null and p.Check_Token != "" and c.Check_Token is not null and c.Check_Token != "" and p.status=1 and c.status=1
            ORDER BY
                COALESCE(r.Modified_On, r.Created_On) DESC;
        END;
    END IF;
END//
DELIMITER ;
