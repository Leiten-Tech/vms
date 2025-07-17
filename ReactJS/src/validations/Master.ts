import { object, string, number, array, date, InferType } from "yup";
import { boolean, mixed } from "yup";

//Login
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailRegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const mobileNoPattern = /^(\d{1,3}-)?\d{3}-?\d{4}$/;


export const AuthValidationScheam = object({
  // UserName: string().required("Username is required"),
  MobileNo: string().required("Mobile No is required"),
  PassWord: string()
    // .matches(passwordRegex, "Password is not Valid")
    .required("Password is required"),
});

// State
export const StateValidationSchema = object({
  StateName: string()
    .required("State Name is Required")
    .max(90, "Maximum 90 characters allowed"),
  Status: number().required("Status is Required"),
  CountryName: number().required("Country Name is Required"),
});

// City
export const CityValidationSchema = object({
  CountryId: string().nullable().required("Country Name is Required"),
  StateId: string().nullable().required("State Name is Required"),
  CityName: string()
    .required("City Name is Required")
    .max(90, "Maximum 90 characters allowed"),
  Status: number().required("Status is Required"),
});
// Company

export const CompanyValidationSchema = object({
  CompanyName: string()
    .required("Company Name is required")
    .max(90, "Maximum 90 characters allowed"),
  CountryId: number().required("Country Name is Required"),
  StateId: number().required("State Name is Required"),
  CityId: string().required("City Name is Required"),
  Status: number().required("Status is required"),
  Mail: string()
    .required("Mail ID is required")
    .matches(emailRegExp, "Please Enter Valid Email ID"),
  Host: string().required("Host is required"),
  Port: string().required("Port is required"),
  UserName: string().required("User Name is required"),
  Password: string().required("Password is required"),
});
// Country
export const CountryValidationSchema = object({
  CountryName: string()
    .required("Country Name is required")
    .max(90, "Maximum 90 characters allowed"),
  Nationality: string()
    .required("Nationality is required")
    .max(30, "Maximum 30 characters allowed"),
  Status: number().required("Status is required"),
  CountryShortform: string()
    .required("Country shortform is required")
    .max(20, "Maximum 20 characters allowed"),
});

// Numbering Schema
export const NumberingSchemaValidationSchema = object({
  Document: string().required("Document is required"),
  EnterPrefix: string().required("Please enter Prefix"),
  Entersuffix: string().required("Please enter Suffix"),
  SymbolFields: string().required("Please select symbol"),
  DateFormat: string().required("Please select Date Format"),
  Status: number().required("Status is required"),
});

//Role
export const RoleValidationSchema = object({
  RoleName: string().required("Role Name is required"),
  Status: number().required("Status is required"),
});

export const RoleWiseScreenValidationSchema = object({
  RoleName: string()
    .required("Role Name is required")
    .max(30, "Maximum 30 characters allowed"),
  ModuleName: array().required("Module is required"),
});

// User
const passwordUserRegex = /^(?=[A-Z])(?=.*[a-z])(?=.*[@$!%*?&]).{8,}$/;
export const UserValidationSchema = object({
  UserName: string()
    .required("User Name is required")
    .max(90, "Maximum 90 characters allowed"),
  // EmpId: number().required("Please Select Employee"),
  // Password: string()
  //   .matches(passwordUserRegex, "Password is not Valid")
  //   .required("User Password is required"),
  CompanyId: number().required("Please Select Default Company"),
  PlantId: number().required("Please Select Default Plant"),
  DefaultRoleId: number().required("Please SelectDefault  Role"),
  // GateId: number().required("Please SelectDefault  Gate"),
  Status: number().required("Status is Required"),
  UserEmail: string()
    .matches(emailRegExp, "Please Enter Valid Email ID")
    .max(200, "Maximum Length Exceeded."),
  UserTelNo: string()
    .required("Please Enter Mobile No.")
    .max(15, "Maximum Length Exceeded.")
    .min(9, "Minimum Length is 9"),
  SecondaryMobileNo: string()
    .max(15, "Maximum Length Exceeded.")
    .min(9, "Minimum Length is 9"),
  DeptId: number().required("Please Select  Department."),
});

// gate
export const GateValidationSchema = object({
  GateName: string()
    .required("Please Enter Gate Name")
    .max(90, "Maximum Length Exceeded."),
  GateNo: string()
    .required("Please Enter Gate No")
    .max(90, "Maximum Length Exceeded."),
  // GateInchargeId: number().required("Please Select Gate Incharge Name"),
  GateOpenTime: date().required("Please Select Gate Open Time"),
  GateCloseTime: date().required("Please Select Gate Close Time"),
  CompanyId: number().required("Please Select Company Name."),
  PlantId: number().required("Please Select Plant Name."),
  Status: number().required("Please Select Status."),
});


// gateDetail
export const GateDetailValidationSchema = object({
  SecurityId: number().required("Please Select Security Name."),
});

// export const PlantValidationSchema = object({
//   CompanyId: string().required("Please Select Company"),
//   PlantType: string().required("Please Select Plant Type"),
//   PlantName: string().required("Please Select Plant Name"),
//   // Address: string().required("Address is required"),
//   CountryId: string().required("Please Select Country"),
//   StateId: string().required("Please Select State"),
//   CityId: string().required("Please Select City"),
//   Status: number().required("Status is required"),
// });

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const PlantValidationSchema = object({
  CompanyId: string().required("Please Select Company"),
  PlantType: string().required("Please Select Plant Type"),
  PlantName: string().required("Please Select Plant Name"),
  // Address: string().required("Address is required"),
  CountryId: string().required("Please Select Country"),
  StateId: string().required("Please Select State"),
  CityId: string().required("Please Select City"),
  Status: number().required("Status is required"),

   ToMail: string()
    .required("To Mail is required")
    .test("valid-to-emails", "Invalid email(s) in To Mail", function (value) {
      if (!value) return false;
      const emails = value.split(',').map(e => e.trim());
      return emails.every(email => emailRegex.test(email));
    }),

 
  CcMail: string()
  .test("valid-cc-emails", "Invalid CC email(s)", function (value) {
    const { ToMail } = this.parent;
    if (!value) return true;

    const ccEmails = value.split(',').map(e => e.trim().toLowerCase());
    const toEmails = (ToMail || '').split(',').map(e => e.trim().toLowerCase());

  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const hasInvalid = ccEmails.some(email => !emailRegex.test(email));
    if (hasInvalid) {
      return this.createError({
        path: "CcMail",
        message: "One or more CC emails are invalid or contain special characters",
      });
    }

    
    const hasDuplicate = ccEmails.some(email => toEmails.includes(email));
    if (hasDuplicate) {
      return this.createError({
        path: "CcMail",
        message: "Cc Mail must not contain the same email(s) as To Mail",
      });
    }

    return true;
  }),
});

//Visitor
//Visitor
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export const VisitorValidationSchema = object({
  // VisitorTypeId: number().required("Please Select Visitor Type."),
  // // CountryId: number().required("Please Select Country."),
  // // StateId: number().required("Please Select State."),
  // // CityId: number().required("Please Select City."),
  // TitleId: number().required("Please Select Title."),
  // FirstName: string()
  //   .required("Please Enter First Name.")
  //   .max(100, "Maximum Length Exceeded."),
  // LastName: string()
  //   .required("Please Enter Last Name.")
  //   .max(100, "Maximum Length Exceeded."),
  // // Dob: date().required("Please Select Date Of Birth"),
  // Address: string().required("Please Enter Address."),
  // MailId: string()
  //   .matches(emailRegExp, "Please enter a valid Mail ID")
  //   .required("Please enter Mail ID.")
  //   .max(100, "Maximum Length Exceeded."),
  // MobileNo: string()
  //   // .matches(phoneRegExp, "Phone number is not valid")
  //   .required("Please Enter Mobile No.")
  //   .min(9, "Minimum Length is 9.")
  //   .max(15, "Maximum Length Exceeded."),
  // // IdCardType: number().required("Please Select ID Card Type."),
  // // IdCardNo: string()
  // //   .required("Please Enter ID Card No.")
  // //   .max(100, "Maximum Length Exceeded."),
  // Status: number().required("Please Select Status."),
});
//Visitor Detail
export const VisitorDetailValidationSchema = object({
  // TitleId: number().required("Please Select Title."),
  // FirstName: string()
  //   .required("Please Enter First Name.")
  //   .max(100, "Maximum Length Exceeded."),
  // LastName: string()
  //   .required("Please Enter Last Name.")
  //   .max(100, "Maximum Length Exceeded."),
  // DepartmentId: number().required("Please Select Department."),
  // Dob: date().required("Please Select Date Of Birth"),
  // MailId: string()
  //   .matches(emailRegExp, "Please enter a valid Mail ID")
  //   .max(100, "Maximum Length Exceeded."),
  // MobileNo: string()
  //   // .matches(phoneRegExp, "Mobile No is not valid")
  //   .required("Please Enter Mobile No.")
  //   .min(9, "Minimum Length is 9.")
  //   .max(15, "Maximum Length Exceeded."),
  // IdCardType: number().required("Please Select ID Card Type."),
  // IdCardNo: string()
  //   .required("Please Enter ID Card No.")
  //   .max(100, "Maximum Length Exceeded."),
  // Status: number().required("Please Select Worker Status."),
  // ExpirryDate: date().required("Please Select Expiry Date. "),
  // WorkSeverity: number().required("Please Select Worker Status."),
});
// Area
export const AreaValidationSchema = object({
  CompanyId: string().required("Please Select Company "),
  PlantId: string().required("Please Select Plant "),
  AreaName: string().required("Area is required"),
  Status: number().required("Please Select Status."),
});

// Material
export const MaterialValidationSchema = object({
  // MaterialType: string()
  //   .required("Material Type is Required")
  //   .max(100, "Maximum 100 characters allowed"),
  // MaterialCategory: string()
  //   .required("Material Category is Required")
  //   .max(100, "Maximum 100 characters allowed"),
  // MaterialSubCategory: string()
  //   .required("Material Sub Category is Required")
  //   .max(100, "Maximum 100 characters allowed"),
  MaterialName: string()
    .required("Material Name is Required")
    .max(100, "Maximum 100 characters allowed"),
  BrandName: string()
    .required("Brand Name is Required")
    .max(100, "Maximum 100 characters allowed"),
  Uom: number().required("Unit is Required"),
  // PurchasePrice: number().required("Purchase Price is Required"),
  Status: number().required("Status is Required"),
});

export const DepartmentValidationSchema = object({
  DepartmentName: string().required("Department is required"),
});

export const RouteValidationSchema = object({
  RouteName: string().required(" Route Name is required"),
  FromLocation: string().required("From Location is required"),
  ToLocation: string().required("To Location is required"),
  RouteDistanceInKm: string()
    .required("Distance is required")
});

// customer
export const customerValidationSchema = object({
  CustomerName: string()
    .required("Customer Name is required")
    .max(50, "Maximum 50 characters allowed"),
  ContactPerson: string()
    .required("Contact Person Name is required")
    .max(50, "Maximum 50 characters allowed"),
  PhoneNumber: string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Please Enter Mobile No.")
    .min(9, "Minimum Length is 9.")
    .max(15, "Maximum Length Exceeded."),
  Email: string()
    .matches(emailRegExp, "Invalid email address")
    .required("Email is required"),
  CountryId: number().required("Please Select Country."),
  StateId: number().required("Please Select State."),
  CityId: number().required("Please Select City."),
});
export const SupplierValidationSchema = object({
  SupplierTypeId: number().required("Please Select Supplier Type."),
  SupplierCategoryId: number().required("Please Select Supplier Category."),
  SupplierName: string()
    .required("Please Enter Supplier Name.")
    .max(100, "Maximum Length Exceeded."),
  SupplierMobileNo: string()
    .matches(phoneRegExp, "Mobile number is not valid")
    .required("Please Enter Mobile No.")
    .max(15, "Maximum Length Exceeded.")
    .min(9, "Minimum Length is 9."),
  SupplierMobileNo2: string()
    .matches(phoneRegExp, "Mobile number is not valid")
    .max(15, "Maximum Length Exceeded.")
    .min(9, "Minimum Length is 9."),
  SupplierMailId: string()
    .matches(emailRegExp, "Please Enter Valid Mail ID")
    .required("Please Enter Mail ID.")
    .max(100, "Maximum Length Exceeded."),
  // SupplierGstNo: string().required("Please Enter GST No."),
  CountryId: number().required("Please Select Country."),
  StateId: number().required("Please Select State."),
  CityId: number().required("Please Select City."),
  Address: string().required("Please Enter Address."),
  Status: number().required("Please Select Worker Status."),
});
  const vehNoRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/i;
// vehicle
export const VehicleValidationSchema = object({
  VehicleType: number().required("Please Select Vehicle Type"),
  // VehicleName: string()
  //   .required("Please Enter Vehicle Name")
  //   .max(90, "Maximum Length Exceeded."),
  VehicleNo: string()
    .required("Please Enter Vehicle No")
    // .matches(vehNoRegex, "Invalid Vehicle Number Format. Expected format: AB00EX0000.")
    .max(25, "Maximum Length Exceeded."),
  VehicleModel: string()
    .required("Please Enter Vehicle Model")
    .max(50, "Maximum Length Exceeded."),
  // VehicleFcDate: date().required("Please Select Last Vehicle FC Date"),
  // ServiceDate: date().required("Please Select Last Service Date"),
  Status: number().required("Please Select Status."),
});
// vehicleDetail
export const VehicleDetailValidationSchema = object({
  DocumentName: string()
    .required("Please Enter DocumentName")
    .max(90, "Maximum Length Exceeded."),
  DocumentNo: string()
    .required("Please Enter DocumentNo")
    .max(90, "Maximum Length Exceeded."),
});

// Shift
export const shiftValidationSchema = object({
  ShiftName: string().required("Please Enter Shift Name"),
  FromTime: string().required("Please Enter Shift From Time"),
  ToTime: string().required("Please Enter Shift To Time"),
});
//Employee
export const EmployeeValidationSchema = object({
  FirstName: string()
    .required("Please Enter First Name.")
    .max(30, "Maximum Length Exceeded."),
  LastName: string()
    .required("Please Enter Last Name.")
    .max(30, "Maximum Length Exceeded."),
  Email: string()
    .matches(emailRegExp, "Please Enter Valid Email ID")
    .required("Please Enter Email ID.")
    .max(90, "Maximum Length Exceeded."),
  PrimaryMobileNo: string()
    .required("Please Enter Mobile No.")
    .max(15, "Maximum Length Exceeded.")
    .min(9, "Minimum Length is 9"),
  SecondaryMobileNo: string()
    .max(15, "Maximum Length Exceeded.")
    .min(9, "Minimum Length is 9"),
  IdcardNo: string()
    .required("Please Enter Employee ID Card No.")
    .max(90, "Maximum Length Exceeded."),
  Address: string()
    .required("Please Enter Address.")
    .max(500, "Maximum Length Exceeded."),
  DesignationId: number().required("Please Select Designation."),
  DeptId: number().required("Please Select  Department."),
  MaritalStatus: number().required("Please Select  Marital Status."),
  Gender: number().required("Please Select  Gender."),
  EmpTypeId: number().required("Please Select  Emp Type."),
  BloodGroup: number().required("Please Select  BloodGroup."),
  ReportingPerson: number().required("Please Select  Reporting Person."),
  Status: number().required("Please Select  Status."),
  DateOfJoining: date().required("Please Select Date Of Joining"),
  Dob: date().required("Please Select Date Of Birth"),
});
//EmployeeDetail
export const EmployeeDetailValidationSchema = object({
  DocumentName: string()
    .required("Please Enter Document Name.")
    .max(90, "Maximum Length Exceeded."),
  DocumentNo: string()
    .required("Please Enter Document No.")
    .max(90, "Maximum Length Exceeded."),
});

export const UserScreenValidationSchema = object({
  Role: number().required("Role is Required"),
  User: number().required("User is Required"),
  Module: array().required("Module is required"),
});

//Approval
export const ApprovalValidationSchema = object({
  PlantId: number().required("Please Select Plant."),
  DocumentId: number().required("Please Select Document."),
  ApprovalActivityId: number().required("Please Select Approval Activity."),
});

//ApprovalDetail

// export const ApprovalDetailValidationSchema = object({
//   LevelId: number().required("Please Select Level."),
//   RoleId: number().required("Please Select Role."),
//   PrimaryUserId: number().required("Please Select Primary User."),
// });
export const ApprovalDetailValidationSchema = object({
  IsHost: boolean().default(false),

  LevelId: number().required("Please Select Level."),

  RoleId: number()
    .nullable()
    .when("IsHost", (isHost, schema) =>
      !Boolean(isHost)
        ? schema.required("Please Select Role.")
        : schema.nullable()
    ),

  PrimaryUserId: number()
    .nullable()
    .when("IsHost", (isHost, schema) =>
      !Boolean(isHost)
        ? schema.required("Please Select Primary User.")
        : schema.nullable()
    ),

  SecondaryUserId: number()
    .nullable()
    .when("IsHost", (isHost, schema) =>
      !Boolean(isHost)
        ? schema.required("Please Select Secondary User.")
        : schema.nullable()
    ),
});





export const NotificationDetailValidationSchema = object({
  LevelId: number().required("Please Select Level."),
  DepartmentId: number().required("Please Select Department."),
  PrimaryUserId: number().required("Please Select Primary User."),
});

//RptCheckinCheckout
export const RptCheckInCheckOutValidationSchema = object({
  FromDate: string().required("Please Select From Date"),
  ToDate: string().required("Please Select To Date"),
  PlantName: array().required("Please Select Plant Name"),
});

//externalVisitor
export const externalVisitor = object({});


export const InstructionsValidationSchema = object({

  InstructionName: string()
    .required("Please Type Name")
    .max(50, "Maximum Length Exceeded."),
});
