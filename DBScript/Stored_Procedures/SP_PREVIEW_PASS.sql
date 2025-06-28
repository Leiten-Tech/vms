DELIMITER //

DROP PROCEDURE IF EXISTS SP_PREVIEW_PASS;

create procedure SP_PREVIEW_PASS(
   IN type varchar(255)
)
begin
    IF (type='createInitialize') THEN
		select
		Plant_Id PlantId,
		Plant_Code PlantCode,
		Plant_Name PlantName,
		Plant_Type PlantType,
		Address Address,
		Geo_Location GeoLocation,
		Country_Id CountryId,
		city_Id cityId,
		State_Id StateId,
		Company_Id CompanyId,
		Status Status,
		URL_Token URLToken,
		Check_Token CheckToken
		from plant WHERE Status=1 and Check_Token is not null and Check_Token != "";
	END IF;
END//
DELIMITER ;