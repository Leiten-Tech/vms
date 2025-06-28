using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Services.Master.UserService
{
    public class UserService : IUserService
    {
        private readonly DbContextHelper dbContext;
        private readonly IDapperContext dapperContext;
        private readonly UserDTO dto;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly FileUploadService.FileUploadService uploadService;

        public UserService(
            DbContextHelper _dbContextHelper,
            IDapperContext _dapperContext,
            IHttpContextAccessor _httpContextAccessor,
            FileUploadService.FileUploadService _uploadService
        )
        {
            dbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            uploadService = _uploadService;
            httpContextAccessor = _httpContextAccessor;
            dto = new UserDTO();
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }

        public async Task<object> CreateInitialize(JObject obj)
        {
            int UserId = obj["UserId"].ToObject<int>();
            int RoleId = obj["RoleId"].ToObject<int>();
            int CompanyId = obj["CompanyId"].ToObject<int>();
            int PlantId = obj["PlantId"].ToObject<int>();
            string Type = "CreateInitialize";
            string SchemeEmp =
                httpContextAccessor.HttpContext.Request.Scheme
                + "://"
                + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                + "/upload/Employee/";
            string SchemeUser =
                httpContextAccessor.HttpContext.Request.Scheme
                + "://"
                + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                + "/upload/User/";
            string SchemeUserDSign =
                httpContextAccessor.HttpContext.Request.Scheme
                + "://"
                + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                + "/upload/UserDigitalSigns/";
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_USERS_CI",
                        new
                        {
                            Type,
                            UserId,
                            CompanyId,
                            PlantId,
                            SchemeEmp,
                            SchemeUser,
                            SchemeUserDSign,
                            NewUserId = (object)null,
                            RoleId,
                        }
                    );
                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    // dto.EmployeeList = (await spcall.ReadAsync<Employee>()).OrderBy(e => e.FirstName).ToList();
                    dto.CompanyList = (await spcall.ReadAsync<Company>()).ToList();
                    dto.RoleList = (await spcall.ReadAsync<Role>()).ToList();
                    dto.DepartmentList = (await spcall.ReadAsync<Department>()).ToList();

                    dto.UserRoleMapList = (await spcall.ReadAsync<UserRoleMap>()).ToList();
                    dto.UserCompanyMapList = (await spcall.ReadAsync<UserCompanyMap>()).ToList();
                    dto.UserPlantMapList = (await spcall.ReadAsync<UserPlantMap>()).ToList();
                    dto.UserGateMapList = (await spcall.ReadAsync<UserGateMap>()).ToList();
                    dto.PlantList = (await spcall.ReadAsync<Plant>()).ToList();
                    dto.GateList = (await spcall.ReadAsync<Gate>()).ToList();

                    if (UserId > 0)
                    {
                        dto.HdrTable = (await spcall.ReadAsync<User>()).SingleOrDefault();
                        dto.PlantList = (await spcall.ReadAsync<Plant>()).ToList();
                        dto.GateList = (await spcall.ReadAsync<Gate>()).ToList();
                        dto.HdrTable.UserRoleMaps = (
                            await spcall.ReadAsync<UserRoleMap>()
                        ).ToList();
                        dto.HdrTable.UserCompanyMaps = (
                            await spcall.ReadAsync<UserCompanyMap>()
                        ).ToList();
                        dto.HdrTable.UserPlantMaps = (
                            await spcall.ReadAsync<UserPlantMap>()
                        ).ToList();
                        dto.HdrTable.UserGateMaps = (
                            await spcall.ReadAsync<UserGateMap>()
                        ).ToList();
                    }
                    dto.transtatus.result = true;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem { Message = "Something Went Wrong, Please Try Again." }
                    );
                }
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<object> SearchInitialize(JObject obj)
        {
            int UserId = obj["UserId"].ToObject<int>();
            string Type = "SearchInitialize";
            long PlantId = obj["PlantId"].ToObject<long>();
            int CompanyId = obj["CompanyId"].ToObject<int>();
            int RoleId = obj["RoleId"].ToObject<int>();
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_USERS_CI",
                        new
                        {
                            Type,
                            UserId,
                            PlantId,
                            CompanyId,
                            SchemeEmp = (object)null,
                            SchemeUser = (object)null,
                            SchemeUserDSign = (object)null,
                            NewUserId = (object)null,
                            RoleId,
                        }
                    );
                    dto.UserList = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.transtatus.result = true;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem { Message = "Something Went Wrong, Please Try Again." }
                    );
                }
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<object> Create(JObject obj, IFormFile webfile, IFormFile digitalSign)
        {
            try
            {
                User User = obj["User"].ToObject<User>();
                User.UserRoleMaps = obj["UserRoleMap"].ToObject<List<UserRoleMap>>();
                User.UserCompanyMaps = obj["UserCompanyMap"].ToObject<List<UserCompanyMap>>();
                User.UserPlantMaps = obj["UserPlantMap"].ToObject<List<UserPlantMap>>();
                User.UserGateMaps = obj["UserGateMap"].ToObject<List<UserGateMap>>();
                bool typeUpdate = obj["Type"].ToObject<bool>();
                dto.LoggedUser = User;
                ValidateUser(dto.LoggedUser);
                var phoneNo = dbContext.Users.Where(p => p.UserTelNo == User.UserTelNo).ToList();
                var phoneNo2 = dbContext
                    .Users.Where(p => p.SecondaryMobileNo == User.SecondaryMobileNo)
                    .ToList();
                var email = dbContext.Users.Where(p => p.UserEmail == User.UserEmail).ToList();
                string PhEmpName = "";
                string SecPhEmpName = "";
                string MailEmpName = "";
                if (email.Count > 0 && User.UserEmail != "")
                {
                    MailEmpName = String.Join(",", email.Select(x => x.UserName));
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                " Email ID: \""
                                + User.UserEmail
                                + "\" is already exists for user Name \""
                                + MailEmpName
                                + "\"",
                        }
                    );
                    return dto;
                }
                if (phoneNo.Count > 0 && User.UserTelNo != "")
                {
                    PhEmpName = String.Join(",", phoneNo.Select(x => x.UserName));
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                " Mobile Number: \""
                                + User.UserTelNo
                                + "\" is already exists for user Name \""
                                + PhEmpName
                                + "\"",
                        }
                    );
                    return dto;
                }
                if (User.SecondaryMobileNo != "" && User.SecondaryMobileNo != null)
                {
                    if (phoneNo2.Count > 0)
                    {
                        SecPhEmpName = String.Join(",", phoneNo2.Select(x => x.UserName));
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                ErrorNo = "VMS000",
                                Message =
                                    " Email ID: \""
                                    + User.UserEmail
                                    + "\" is already exists for user Name \""
                                    + SecPhEmpName
                                    + "\"",
                            }
                        );
                        return dto;
                    }
                }
                if (User.SecondaryMobileNo != "" && User.UserTelNo != "")
                {

                    if (User.UserTelNo == User.SecondaryMobileNo)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                ErrorNo = "VMS000",
                                Message =
                                    "Mobile Number & Secondary Mobile Number should not be same values.",
                            }
                        );
                        return dto;
                    }
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    var returnedimage = uploadService.UploadFile(webfile, "User");
                    var returnedDigitalSign = uploadService.UploadFile(
                        digitalSign,
                        "UserDigitalSigns"
                    );
                    // auto generate user
                    User.UserCode = await GenerateUniqueCode();

                    var hashedPassword = HashPassword(User.Password);
                    var hashedPasswordString = ByteArrayToString(hashedPassword);
                    User.Password = hashedPasswordString;

                    dbContext.Users.Add(User);
                    await dbContext.SaveChangesAsync();
                    dto.HdrTable = User;
                    dto.transtatus.result = true;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem { Message = "Created Successfully" }
                    );
                }
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        // FOR Encrypted Password//
        public static byte[] HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var saltedPassword = Encoding.UTF8.GetBytes(password);
                var saltedPasswordWithSalt = new byte[saltedPassword.Length];

                Buffer.BlockCopy(
                    saltedPassword,
                    0,
                    saltedPasswordWithSalt,
                    0,
                    saltedPassword.Length
                );
                //Buffer.BlockCopy(salt, 0, saltedPasswordWithSalt, saltedPassword.Length);

                return sha256.ComputeHash(saltedPasswordWithSalt);
            }
        }

        public static string ByteArrayToString(byte[] byteArray)
        {
            var sb = new StringBuilder();
            foreach (var b in byteArray)
            {
                sb.Append(b.ToString("x2"));
            }
            return sb.ToString();
        }

        public void ValidateUser(User user)
        {
            String UserName = user.UserName;
            String Password = user.Password;
            long UserId = user.UserId;
            // var Employee = dbContext.Employees.AsNoTracking().Where(e=>e.EmployeeId == user.EmpId).ToList();
            // string employeeName = Employee.Select(e=>e.FirstName+ " "+ e.LastName).SingleOrDefault();
            // var User = dbContext.Users.AsNoTracking().Where(u=>u.EmpId == user.EmpId).ToList();
            // string uname = User.Select(u=>u.UserName).SingleOrDefault();
            if (string.IsNullOrWhiteSpace(UserName))
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = "Please Enter User Name." }
                );
            }
            if (string.IsNullOrWhiteSpace(Password))
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = "Please Enter Password." }
                );
            }
            if (
                dbContext.Users.Any(a =>
                    a.UserName == UserName && a.UserId != UserId && a.CompanyId == user.CompanyId
                )
            )
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message =
                            "User Name \"" + dto.LoggedUser.UserName + "\" is already exists.",
                    }
                );
            }
            // if (dbContext.Users.Any(u => u.EmpId == user.EmpId && u.UserId != user.UserId))
            // {
            //     dto.transtatus.result = false;
            //     dto.transtatus.lstErrorItem.Add(
            //         new ErrorItem
            //         {
            //             ErrorNo = "VM0000",
            //             Message = "\"" +employeeName +"\" Employee has already mapped for \""+uname+ "\" user."
            //         }
            //     );
            // }
        }

        public async Task<object> Update(JObject obj, IFormFile webfile, IFormFile digitalSign)
        {
            try
            {
                User User = obj["User"].ToObject<User>();
                User.UserRoleMaps = obj["UserRoleMap"].ToObject<List<UserRoleMap>>();
                User.UserCompanyMaps = obj["UserCompanyMap"].ToObject<List<UserCompanyMap>>();
                User.UserPlantMaps = obj["UserPlantMap"].ToObject<List<UserPlantMap>>();
                User.UserGateMaps = obj["UserGateMap"].ToObject<List<UserGateMap>>();
                bool typeUpdate = obj["Type"].ToObject<bool>();

                dto.LoggedUser = User;
                ValidateUser(dto.LoggedUser);
                var phoneNo = dbContext
                    .Users.Where(p => p.UserTelNo == User.UserTelNo && p.UserId != User.UserId)
                    .ToList();
                var phoneNo2 = dbContext
                    .Users.Where(p =>
                        p.SecondaryMobileNo == User.SecondaryMobileNo && p.UserId != User.UserId
                    )
                    .ToList();
                var email = dbContext
                    .Users.Where(p => p.UserEmail == User.UserEmail && p.UserId != User.UserId)
                    .ToList();
                string PhEmpName = "";
                string SecPhEmpName = "";
                string MailEmpName = "";
                if (email.Count > 0 && User.UserEmail != "")
                {
                    MailEmpName = String.Join(",", email.Select(x => x.UserName));
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                " Email ID: \""
                                + User.UserEmail
                                + "\" is already exists for user Name \""
                                + MailEmpName
                                + "\"",
                        }
                    );
                    return dto;
                }
                if (phoneNo.Count > 0 && User.UserTelNo != "")
                {
                    PhEmpName = String.Join(",", phoneNo.Select(x => x.UserName));
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                " Mobile Number: \""
                                + User.UserTelNo
                                + "\" is already exists for user Name \""
                                + PhEmpName
                                + "\"",
                        }
                    );
                    return dto;
                }
                if (User.SecondaryMobileNo != "" && User.SecondaryMobileNo != null)
                {
                    if (phoneNo2.Count > 0)
                    {
                        SecPhEmpName = String.Join(",", phoneNo2.Select(x => x.UserName));
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                ErrorNo = "VMS000",
                                Message =
                                    " Secondary No: \""
                                    + User.SecondaryMobileNo
                                    + "\" is already exists for user Name \""
                                    + SecPhEmpName
                                    + "\"",
                            }
                        );
                        return dto;
                    }
                }
                if (User.SecondaryMobileNo != "" && User.UserTelNo != "")
                {

                    if (User.UserTelNo == User.SecondaryMobileNo)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                ErrorNo = "VMS000",
                                Message =
                                    "Mobile Number & Secondary Mobile Number should not be same values.",
                            }
                        );
                        return dto;
                    }
                }
                using (var transaction = dbContext.Database.BeginTransactionAsync())
                {
                    if (User.Status == 1)
                    {
                        // var empStatus = dbContext.Employees.Where(e => e.Status == 2 & e.EmployeeId == User.EmpId).ToList();
                        // var empName = dbContext.Employees.Where(e => e.EmployeeId == User.EmpId).ToList();
                        // var employeeName = empName.Select(e => e.FirstName + " " + e.LastName).ToList();
                        string employee = "";
                        // if (empStatus.Count > 0)
                        // {
                        //     employee = string.Join(",", employeeName);
                        //     dto.transtatus.result = false;
                        //     dto.transtatus.lstErrorItem.Add(
                        //         new ErrorItem
                        //         {
                        //             ErrorNo = "VM0000",
                        //             Message = "Cannot activate this User. \"" + employee + "\" Employee is inactive"
                        //         }
                        //     );
                        // }
                    }
                    if (dto.transtatus.lstErrorItem.Count == 0)
                    {
                        if (User.UserRoleMaps.Count > 0)
                        {
                            var userRoleMap = await dbContext
                                .UserRoleMaps.AsNoTracking()
                                .Where(a => a.UserId == User.UserId)
                                .ToListAsync();
                            dbContext.UserRoleMaps.RemoveRange(userRoleMap);
                        }
                        if (User.UserCompanyMaps.Count > 0)
                        {
                            var userCompanyMap = await dbContext
                                .UserCompanyMaps.AsNoTracking()
                                .Where(a => a.UserId == User.UserId)
                                .ToListAsync();
                            dbContext.UserCompanyMaps.RemoveRange(userCompanyMap);
                        }
                        if (User.UserPlantMaps.Count > 0)
                        {
                            var UserPlantMap = await dbContext
                                .UserPlantMaps.AsNoTracking()
                                .Where(a => a.UserId == User.UserId)
                                .ToListAsync();
                            dbContext.UserPlantMaps.RemoveRange(UserPlantMap);
                        }
                        if (User.UserGateMaps.Count > 0)
                        {
                            var UserGateMap = await dbContext
                                .UserGateMaps.AsNoTracking()
                                .Where(a => a.UserId == User.UserId)
                                .ToListAsync();
                            dbContext.UserGateMaps.RemoveRange(UserGateMap);
                        }
                        var returnedimage = uploadService.UploadFile(webfile, "User");
                        var returnedDigitalSign = uploadService.UploadFile(
                            digitalSign,
                            "UserDigitalSigns"
                        );
                        if (typeUpdate)
                        {
                            var hashedPassword = HashPassword(User.Password);
                            var hashedPasswordString = ByteArrayToString(hashedPassword);
                            User.Password = hashedPasswordString;
                        }
                        dbContext.Users.Update(User);
                        await dbContext.SaveChangesAsync();
                        await dbContext.Database.CommitTransactionAsync();
                        dto.transtatus.result = true;
                        dto.transtatus.lstErrorItem.Add(
                            new ErrorItem { Message = "Updated Successfully" }
                        );
                    }
                }
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<object> ChangeStatus(JObject obj)
        {
            int UserId = obj["UserId"].ToObject<int>();
            try
            {
                User User = dbContext.Users.Where(y => y.UserId == UserId).SingleOrDefault();
                User.Status = 2;
                dbContext.Users.Update(User);
                await dbContext.SaveChangesAsync();
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { Message = "Status has been changed successfully" }
                );
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<Object> OnChangeCompany(JObject obj)
        {
            try
            {
                long CompanyId = obj["Companyid"].ToObject<long>();
                string Type = "OnChangeCompany";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_USERS_CI",
                        new
                        {
                            Type,
                            userId = (object)null,
                            CompanyId,
                            PlantId = (object)null,
                            SchemeEmp = (object)null,
                            SchemeUser = (object)null,
                            SchemeUserDSign = (object)null,
                            NewUserId = (object)null,
                            RoleId = (object)null,
                        }
                    );
                    dto.PlantList = (await spcall.ReadAsync<Plant>()).ToList();
                }
                dto.transtatus.result = true;
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<Object> OnChangePlant(JObject obj)
        {
            try
            {
                long Plantid = obj["Plantid"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();

                string Type = "OnChangePlant";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_USERS_CI",
                        new
                        {
                            Type,
                            userId = (object)null,
                            CompanyId,
                            Plantid,
                            SchemeEmp = (object)null,
                            SchemeUser = (object)null,
                            SchemeUserDSign = (object)null,
                            NewUserId = (object)null,
                            RoleId = (object)null,
                        }
                    );
                    dto.GateList = (await spcall.ReadAsync<Gate>()).ToList();
                }
                dto.transtatus.result = true;
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "21";
            string series = "45";
            using (dapperContext)
            {
                var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                    spName: "GetPrimaryKey",
                    new { documentid, series }
                );
                documentno = (await spcall.ReadAsync<string>()).SingleOrDefault();
            }
            return documentno;
        }

        public async Task<Object> ScreenMapping(JObject obj)
        {
            try
            {
                string Type = "ScreenMapping";
                long NewUserId = obj["NewUserId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_USERS_CI",
                        new
                        {
                            Type,
                            userId = (object)null,
                            CompanyId = (object)null,
                            PlantId = (object)null,
                            SchemeEmp = (object)null,
                            SchemeUser = (object)null,
                            SchemeUserDSign = (object)null,
                            NewUserId,
                            RoleId,
                        }
                    );
                }
                dto.transtatus.result = true;
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }
    }
}
