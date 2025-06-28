using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;
using Microsoft.EntityFrameworkCore;
using VisitorManagementMySQL.Services.Master.CommonInterface;
using Microsoft.AspNetCore.Http;
namespace VisitorManagementMySQL.Services.Master.EmployeeService
{
    public class EmployeeService : IEmployeeService
    {

        private readonly EmployeeDTO dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly FileUploadService.FileUploadService uploadService;
        public EmployeeService(DbContextHelper _dbContextHelper,
        FileUploadService.FileUploadService _uploadService,
        IHttpContextAccessor httpContextAccessor,
        IDapperContext _dapperContext
        )
        {
            dto = new EmployeeDTO();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            uploadService = _uploadService;
            _httpContextAccessor = httpContextAccessor;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }
        public async Task<object> CreateInitialize(JObject obj)
        {
            long EmployeeId = obj["EmployeeId"].ToObject<int>();
            string Type = "CreateInitialize";
            string Scheme = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host.Value.ToString()}/upload/Employee/";
            string Schemeemployeedetail = _httpContextAccessor.HttpContext.Request.Scheme + "://" + _httpContextAccessor.HttpContext.Request.Host.Value.ToString() + "/upload/EmployeeDocumentDetail/";
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_EMPLOYEE_CI", new
                    {
                        Type,
                        EmployeeId,
                        Scheme,
                        Schemeemployeedetail
                    });
                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.RoleList = (await spcall.ReadAsync<Role>()).ToList();
                    dto.DepartmentList = (await spcall.ReadAsync<Department>()).ToList();
                    dto.GenderList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.MaritalStatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.EmployeeTypeList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.BloodGroupList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.ReportingPersonList = (await spcall.ReadAsync<Employee>()).OrderBy(e => e.FirstName).ToList();

                    if (EmployeeId > 0)
                    {
                        dto.HdrTable = (await spcall.ReadAsync<Employee>()).SingleOrDefault();
                        dto.EmployeeDocumentDetailList = (await spcall.ReadAsync<EmployeeDocumentDetail>()).ToList();
                    }
                }
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "Something Went Wrong, Please Try Again."
                   }
                );

            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }
            return dto;
        }
        public async Task<object> SearchInitialize(JObject obj)
        {
            long EmployeeId = obj["EmployeeId"].ToObject<int>();
            string Type = "SearchInitialize";
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_EMPLOYEE_CI", new
                    {
                        Type,
                        EmployeeId
                    });
                    dto.EmployeeList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "Something Went Wrong, Please Try Again."
                   }
               );
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }
            return dto;
        }
        public async Task<object> Create(JObject obj)
        {
            throw new NotImplementedException();
        }
        public async Task<object> Update(JObject obj)
        {
            throw new NotImplementedException();
        }
        public async Task<object> Update(object obj, IFormFile webfile, List<IFormFile> webfiles)
        {
            try
            {
                Newtonsoft.Json.Linq.JObject _EmployeeJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();
                Employee Employee = (Employee)serializer.Deserialize(new JTokenReader(_EmployeeJSON["Employee"]), typeof(Employee));
                string PhoneNumber = Employee.PrimaryMobileNo;
                string secPhoneNumber = Employee.SecondaryMobileNo;
                string Email = Employee.Email;
                string FirstName = Employee.FirstName;
                string LastName = Employee.LastName;
                var uniquePhoneNumber = DbContext.Employees.AsNoTracking().Where(e => e.PrimaryMobileNo == PhoneNumber & e.EmployeeId != Employee.EmployeeId).ToList();
                var uniqueSecNumber = DbContext.Employees.AsNoTracking().Where(e => e.SecondaryMobileNo == secPhoneNumber & e.EmployeeId != Employee.EmployeeId).ToList();
                var uniqueEmail = DbContext.Employees.AsNoTracking().Where(e => e.Email == Employee.Email & e.EmployeeId != Employee.EmployeeId).ToList();
                var ReportingPerson = DbContext.Employees.AsNoTracking().Where(e => e.ReportingPerson == Employee.EmployeeId).ToList();
                var ReportingPersonName = ReportingPerson.Select(r => r.FirstName + " " + r.LastName).ToList();
                var GateIncharge = DbContext.Gates.AsNoTracking().Where(e => e.GateInchargeId == Employee.EmployeeId).ToList();
                var GateInchargeName = GateIncharge.Select(g => g.GateName).ToList();
                var GateSecurity = DbContext.GateDetails.AsNoTracking().Where(g => g.SecurityId == Employee.EmployeeId).Select(c => c.GateId).ToList();
                var GateSecurityName = DbContext.Gates.AsNoTracking().Where(x => GateSecurity.Contains(x.GateId)).ToList();
                var gsnames = GateSecurityName.Select(g => g.GateName).ToList();
                // var user = DbContext.Users.AsNoTracking().Where(x => x.EmpId == Employee.EmployeeId && x.Status == 1).ToList();
                // List<string> UserName = user.Select(u => u.UserName).ToList();
                string UserIds = "";
                var isExists = DbContext.Employees.Where(x => x.FirstName.Equals(FirstName) && x.LastName.Equals(LastName) && x.EmployeeId != Employee.EmployeeId).ToList();
                if (isExists.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "Employee Name already exists."
                    });
                    return dto;
                }
                if (Employee.Status != 1)
                {
                    if (ReportingPerson.Count > 0)
                    {
                        string ReportingPersonConcat = string.Join(",", ReportingPersonName);
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message = "This Employee is mapped as the Reporting To Person For \"" + ReportingPersonConcat + "\" employee."
                        });
                        return dto;
                    }
                    if (GateIncharge.Count > 0)
                    {
                        string GateInchargeConcat = string.Join(",", GateInchargeName);
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message = "This Employee is mapped as Gate Incharge For \"" + GateInchargeConcat + "\" Gate."
                        });
                        return dto;
                    }
                    if (GateSecurity.Count > 0)
                    {
                        string GateSecurityConcat = string.Join(",", gsnames);
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message = "This Employee is mapped as Gate Security For \"" + GateSecurityConcat + "\" Gate."
                        });
                        return dto;
                    }
                }
                string PhEmpName = "";
                string SecPhEmpName = "";
                string MailEmpName = "";
                if (uniqueEmail.Count > 0)
                {
                    MailEmpName = String.Join(",", uniqueEmail.Select(x => x.FirstName + " " + x.LastName));
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = " Email ID: \"" + Email + "\" is already exists for Employee Name \"" + MailEmpName + "\""
                    });
                    return dto;
                }
                if (uniquePhoneNumber.Count > 0)
                {
                    PhEmpName = String.Join(",", uniquePhoneNumber.Select(x => x.FirstName + " " + x.LastName));
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = " Mobile No: \"" + PhoneNumber + "\" is already exists for Employee Name \"" + PhEmpName + "\""
                    });
                    return dto;
                }
                if (secPhoneNumber != "" && secPhoneNumber != null)
                {
                    if (uniqueSecNumber.Count > 0)
                    {
                        SecPhEmpName = String.Join(",", uniqueSecNumber.Select(x => x.FirstName + " " + x.LastName));
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message = " Secondary Mobile No: \"" + secPhoneNumber + "\" is already exists for Employee Name \"" + SecPhEmpName + "\""
                        });
                        return dto;
                    }
                }
                if (PhoneNumber == secPhoneNumber)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "Mobile Number & Secondary Mobile Number should not be same values."
                    });
                    return dto;
                }

                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    Employee.EmployeeDocumentDetails = (List<EmployeeDocumentDetail>)serializer.Deserialize(new JTokenReader(_EmployeeJSON["EmployeeDocumentDetail"]), typeof(List<EmployeeDocumentDetail>));
                    var resturnstring = uploadService.UploadFile(webfile, "Employee");
                    var resturnstrings = uploadService.UploadFiles(webfiles, "EmployeeDocumentDetail");
                    var webresturnstring = uploadService.UploadFile(webfile, "Employee");
                    var vd = DbContext.EmployeeDocumentDetails.AsNoTracking().Where(x => x.EmployeeId == Employee.EmployeeId).ToList();
                    DbContext.EmployeeDocumentDetails.RemoveRange(vd);
                    // if (Employee.Status != 1 && user.Count > 0)
                    // {
                    //     foreach (var item in user)
                    //     {
                    //         item.Status = 2;
                    //     }
                    //     if (UserName.Count > 0)
                    //     {
                    //         UserIds = String.Join(",", UserName);
                    //     }
                    // }
                   
                    // DbContext.Users.UpdateRange(user);
                    DbContext.Employees.Update(Employee);
                    await DbContext.SaveChangesAsync();
                    dto.transtatus.result = true;
                    if (UserIds.Length > 0)
                    {
                        dto.transtatus.lstErrorItem.Add(
                           new ErrorItem
                           {
                               Message = "Status has been changed successfully and also User\"" + UserIds + "\" Status has been changed successfully"
                           }
                       );
                    }
                    dto.transtatus.lstErrorItem.Add(
                      new ErrorItem
                      {
                          Message = "Updated Successfully"
                      }
                  );
                }
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }
            return dto;
        }
        public async Task<object> ChangeStatus(JObject obj)
        {
            long EmployeeId = obj["EmployeeId"].ToObject<short>();

            try
            {
                var Employee = DbContext.Employees.Where(y => y.EmployeeId == EmployeeId).SingleOrDefault();
                // var user = DbContext.Users.Where(x => x.EmpId == EmployeeId && x.Status == 1).ToList();
                // List<string> UserName = user.Select(u => u.UserName).ToList();
                var ReportingPerson = DbContext.Employees.Where(e => e.ReportingPerson == EmployeeId).ToList();
                var ReportingPersonName = ReportingPerson.Select(r => r.FirstName + " " + r.LastName).ToList();
                var GateIncharge = DbContext.Gates.Where(e => e.GateInchargeId == EmployeeId).ToList();
                var GateInchargeName = GateIncharge.Select(g => g.GateName).ToList();
                var GateSecurity = DbContext.GateDetails.Where(g => g.SecurityId == EmployeeId).Select(c => c.GateId).ToList();
                var GateSecurityName = DbContext.Gates.Where(x => GateSecurity.Contains(x.GateId)).ToList();
                var gsnames = GateSecurityName.Select(g => g.GateName).ToList();
                if (ReportingPerson.Count > 0)
                {
                    string ReportingPersonConcat = string.Join(",", ReportingPersonName);
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "This Employee is mapped as the Reporting To Person For \"" + ReportingPersonConcat + "\" employee."
                    });
                    return dto;
                }
                if (GateIncharge.Count > 0)
                {
                    string GateInchargeConcat = string.Join(",", GateInchargeName);
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "This Employee is mapped as Gate Incharge For \"" + GateInchargeConcat + "\" Gate."
                    });
                    return dto;
                }
                if (GateSecurity.Count > 0)
                {
                    string GateSecurityConcat = string.Join(",", gsnames);
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "This Employee is mapped as Gate Security For \"" + GateSecurityConcat + "\" Gate."
                    });
                    return dto;
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    Employee.Status = 2;
                    // foreach (var item in user)
                    // {
                    //     item.Status = 2;
                    // }
                    string UserIds = "";
                    // if (UserName.Count > 0)
                    // {
                    //     UserIds = String.Join(",", UserName);
                    // }
                    // DbContext.Users.UpdateRange(user);
                    DbContext.Employees.Update(Employee);
                    await DbContext.SaveChangesAsync();
                    dto.transtatus.result = true;
                    if (UserIds.Length > 0)
                    {
                        dto.transtatus.lstErrorItem.Add(
                           new ErrorItem
                           {
                               Message = "Status has been changed successfully and also User\"" + UserIds + "\" Status has been changed successfully"
                           }
                       );
                    }
                    dto.transtatus.lstErrorItem.Add(
                           new ErrorItem
                           {
                               Message = "Status has been changed successfully"
                           }
                       );
                }
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }
            return dto;
        }
        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "20";
            string series = "45";
            using (dapperContext)
            {
                var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "GetPrimaryKey", new
                {
                    documentid,
                    series
                });
                documentno = (await spcall.ReadAsync<string>()).SingleOrDefault();
            }
            return documentno;
        }
        public async Task<object> Create(object obj, IFormFile webfile, List<IFormFile> webfiles)
        {
            try
            {
                Newtonsoft.Json.Linq.JObject _EmployeeJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();
                Employee Employee = (Employee)serializer.Deserialize(new JTokenReader(_EmployeeJSON["Employee"]), typeof(Employee));
                Employee.EmployeeDocumentDetails = (List<EmployeeDocumentDetail>)serializer.Deserialize(new JTokenReader(_EmployeeJSON["EmployeeDocumentDetail"]), typeof(List<EmployeeDocumentDetail>));
                string FirstName = Employee.FirstName;
                string LastName = Employee.LastName;
                string Email = Employee.Email;
                string PhoneNumber = Employee.PrimaryMobileNo;
                string secPhoneNumber = Employee.SecondaryMobileNo;
                var uniquePhoneNumber = DbContext.Employees.Where(e => e.PrimaryMobileNo == PhoneNumber).ToList();
                var uniqueSecNumber = DbContext.Employees.Where(e => e.SecondaryMobileNo == secPhoneNumber).ToList();
                var uniqueEmail = DbContext.Employees.Where(e => e.Email == Employee.Email).ToList();
                //if Name is already exists it show error
                var isExists = DbContext.Employees.Where(x => x.FirstName.Equals(FirstName) && x.LastName.Equals(LastName)).ToList();
                if (isExists.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "Employee Name already exists."
                    });
                    return dto;
                }
                string PhEmpName = "";
                string SecPhEmpName = "";
                string MailEmpName = "";
                if (uniqueEmail.Count > 0)
                {
                    MailEmpName = String.Join(",", uniqueEmail.Select(x => x.FirstName + " " + x.LastName));
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = " Email ID: \"" + Email + "\" is already exists for Employee Name \"" + MailEmpName + "\""
                    });
                    return dto;
                }
                if (uniquePhoneNumber.Count > 0)
                {
                    PhEmpName = String.Join(",", uniquePhoneNumber.Select(x => x.FirstName + " " + x.LastName));
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = " Mobile No: \"" + PhoneNumber + "\" is already exists for Employee Name \"" + PhEmpName + "\""
                    });
                    return dto;
                }
                if (secPhoneNumber != "" && secPhoneNumber != null)
                {
                    if (uniqueSecNumber.Count > 0)
                    {
                        SecPhEmpName = String.Join(",", uniqueSecNumber.Select(x => x.FirstName + " " + x.LastName));
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message = " Secondary Mobile No: \"" + secPhoneNumber + "\" is already exists for Employee Name \"" + SecPhEmpName + "\""
                        });
                        return dto;
                    }
                }
                if (PhoneNumber == secPhoneNumber)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "Mobile Number & Secondary Mobile Number should not be same values."
                    });
                    return dto;
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    var resturnstring = uploadService.UploadFile(webfile, "Employee");
                    var resturnstrings = uploadService.UploadFiles(webfiles, "EmployeeDocumentDetail");
                    //Autogenerate EmployeeCode
                    Employee.EmployeeCode = await GenerateUniqueCode();
                    DbContext.Employees.Add(Employee);
                    await DbContext.SaveChangesAsync();
                    dto.transtatus.result = true;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = "Created Successfully"
                       }
                   );
                }
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }
            return dto;
        }
    }
}