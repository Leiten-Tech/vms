truncate table `function`;
INSERT `function`
(Function_Id,Function_Name,Function_Url,Parent_Id,Is_External,Screen_Order,Function_Status,Is_Approval_Needed,Status,Created_By,Created_On,Modified_By,Modified_On)
values
(1, N'Master',N'~/Master' ,0,1,2,1,0,1,1,NOW(),1,NOW()),
(2, N'DashBoard',N'~/DashBoard' ,0,1,1,1,0,1,1,NOW(),1,NOW()),
(3, N'Visitor Management',N'~/VisitorManagement' ,0,1,6,1,0,1,1,NOW(),1,NOW()),
(4, N'Country',N'/home/vCountry' ,30,1,1,1,0,1,1,NOW(),1,NOW()),
(5, N'State',N'/home/vState' ,30,1,2,1,0,1,1,NOW(),1,NOW()),
(6, N'Material',N'/home/vMaterial' ,1,1,10,1,0,2,1,NOW(),1,NOW()),
(7, N'Vehicle',N'/home/vVehicle' ,1,1,9,1,0,1,1,NOW(),1,NOW()),
(8, N'Visitor Entry',N'/home/vVisitorEntry' ,3,1,2,1,0,2,1,NOW(),1,NOW()),
(9, N'Check In Check Out',N'/home/vCheckInOut' ,3,1,4,1,0,1,1,NOW(),1,NOW()),
(10, N'Shift',N'/home/vShift' ,1,1,8,1,0,1,1,NOW(),1,NOW()),
(11, N'Supplier',N'/home/vSupplier' ,1,1,11,1,0,1,1,NOW(),1,NOW()),
(12, N'SupplierType',N'/home/vSupplierType' ,1,1,5,1,0,2,1,NOW(),1,NOW()),
(13, N'Material Sub Category',N'/home/vMaterialSubCategory' ,1,1,6,1,0,2,1,NOW(),1,NOW()),
(14, N'Company',N'/home/vCompany' ,1,1,1,1,0,1,1,NOW(),1,NOW()),
(15, N'Area',N'/home/vArea' ,1,1,3,1,0,1,1,NOW(),1,NOW()),
(16, N'Route',N'/home/vRoute' ,1,1,5,1,0,1,1,NOW(),1,NOW()),
(17, N'City',N'/home/vCity' ,30,1,3,1,0,1,1,NOW(),1,NOW()),
(18, N'Department',N'/home/vDepartment' ,1,1,4,1,0,1,1,NOW(),1,NOW()),
(19, N'Gate',N'/home/vGate' ,1,1,6,1,0,1,1,NOW(),1,NOW()),
(20, N'Employee',N'/home/vEmployee' ,1,1,7,1,0,2,1,NOW(),1,NOW()),
(21, N'User',N'/home/vUser' ,31,1,1,1,0,1,1,NOW(),1,NOW()),
(22, N'Role',N'/home/vRole' ,31,1,2,1,0,1,1,NOW(),1,NOW()),
(23, N'Customer',N'/home/vCustomer' ,1,1,12,1,0,1,1,NOW(),1,NOW()),
(24, N'Plant',N'/home/vPlant' ,1,1,2,1,0,1,1,NOW(),1,NOW()),
(25, N'Driver',N'/home/vDriver' ,1,1,15,1,0,2,1,NOW(),1,NOW()),
(26, N'Visitor',N'/home/vVisitor' ,3,1,1,1,0,2,1,NOW(),1,NOW()),
(27, N'Numbering Schema',N'/home/vNumberingSchema' ,30,1,4,1,0,2,1,NOW(),1,NOW()),
(28, N'Role Wise Screen Mapping',N'/home/vRoleWiseScreenMapping' ,31,1,3,1,0,1,1,NOW(),1,NOW()),
(29, N'User Wise Screen Mapping',N'/home/vUserWiseScreenMapping' ,31,1,4,1,0,1,1,NOW(),1,NOW()),

(30, N'Admin',N'~/Admin' ,0,1,3,1,0,1,1,NOW(),1,NOW()),
(31, N'Users',N'~/Users' ,0,1,4,1,0,1,1,NOW(),1,NOW()),

(32, N'Approval Configuration',N'/home/vApprovalConfiguration' ,35,1,1,1,0,1,1,NOW(),1,NOW()),
(33, N'WorkFlow',N'/home/vWorkFlow' ,35,1,2,1,0,1,1,NOW(),1,NOW()),
(34, N'Visitor Management',N'/home/cVisitorManagement' ,3,1,3,1,0,1,1,NOW(),1,NOW()),
(35, N'Approval',N'~/Approval' ,0,1,5,1,0,1,1,NOW(),1,NOW()),
(36, N'VMS Dashboard',N'/home/individual' ,2,1,1,1,0,1,1,'2023-11-22',1,'2023-11-22'),
(37, N'Reports',N'~/Reports' ,0,1,7,1,0,1,1,NOW(),1,NOW()),
(38, N'Check In Check Out Report',N'/home/RptCheckinCheckOut' ,37,1,1,1,0,1,1,NOW(),1,NOW()),
(39, N'Terms & Conditions', N'/home/vInstructions' ,1,1,16,1,0,1,1,NOW(),1,NOW()),
(40, N'Work Permit', N'~/WorkPermit' ,0,1,7,1,0,1,1,NOW(),1,NOW()),
(41, N'Vendor Registration', N'/home/vVendorRegistration' ,40,1,1,1,0,1,1,NOW(),1,NOW()),
(42, N'Work Permit', N'/home/vWorkPermit' ,40,1,2,1,0,1,1,NOW(),1,NOW()),
(43, N'CheckPoints Mapping', N'/home/vCheckPointMapping' ,1,1,17,1,0,1,1,NOW(),1,NOW()),
(44, N'Feedback Report', N'/home/vFeedbackReport' ,37,1,2,1,0,1,1,NOW(),1,NOW()),
(45, N'Appointments Calendar',N'/home/vAppointmentCalendar' ,3,1,5,1,0,1,1,NOW(),1,NOW())
;

update `function` set menu_Icon='las la-chart-bar'	 ,rel_link='dashboard' where function_id=2;
update `function` set menu_Icon='las la-tools'		 ,rel_link='masters'   where function_id=1;
update `function` set menu_Icon='las la-id-card'		 ,rel_link='gateentry' where function_id=3;
update `function` set menu_Icon='las la-user-shield'	 ,rel_link='admin'	   where function_id=30;
update `function` set menu_Icon='las la-users'		 ,rel_link='users'	   where function_id=31;
update `function` set menu_Icon='las la-user-check'	 ,rel_link='workflow'  where function_id=35;
update `function` set menu_Icon='las la-file-invoice'	 ,rel_link='reports'  where function_id=37;
update `function` set menu_Icon='las la-briefcase'	 ,rel_link='workpermit'  where function_id=40;





