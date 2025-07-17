CREATE OR REPLACE VIEW Android_Visitor_Validation_View AS 
SELECT 
distinct ved.Mobile_No AS MobileNo,
ve.Visitor_Entry_Code,
ve.Company_Id

FROM visitor_entry ve
INNER JOIN visitor_entry_detail ved ON ved.Visitor_Entry_Id = ve.Visitor_Entry_Id and ve.is_android_visitor = 1
INNER JOIN visitor_entry_log vel ON vel.Visitor_Entry_Code = ve.Visitor_Entry_Code
WHERE EXISTS 
(
	SELECT 1 FROM visitor_entry_log vel_inner
	WHERE vel_inner.Visitor_Entry_Code = ve.Visitor_Entry_Code 
	AND vel_inner.Checked_Out IS NULL and vel_inner.Checked_In IS NOT NULL
);   

