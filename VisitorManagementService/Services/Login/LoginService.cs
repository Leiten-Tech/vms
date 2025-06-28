using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Services.Authentication;
using VisitorManagementMySQL.Services.Common;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Services.Login
{
    public class LoginService : ILoginService
    {
        private readonly DbContextHelper dbContext;
        private readonly ITokenAuthService ITokenAuthService;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IDapperContext dapperContext;
        private readonly MailSettings _mailSettings;
        private readonly ICommonService commonService;

        private LoginDTO dto;

        public LoginService(
            DbContextHelper _dbContext,
            IHttpContextAccessor _httpContextAccessor,
            ITokenAuthService _ITokenAuthService,
            IDapperContext _dapperContext,
            IOptions<MailSettings> mailSettings,
            ICommonService _commonService
        )
        {
            dbContext = _dbContext;
            httpContextAccessor = _httpContextAccessor;
            ITokenAuthService = _ITokenAuthService;
            dapperContext = _dapperContext;
            commonService = _commonService;
            _mailSettings = mailSettings.Value;
            dto = new LoginDTO();
            dto.tranStatus = new ErrorContext();
            dto.tranStatus.result = false;
            dto.tranStatus.lstErrorItem = new List<ErrorItem>();
        }

        public async Task<LoginDTO> Login(JObject obj) //string userName, string password)
        {
            string mobileNo = obj["MobileNo"].ToObject<string>();
            string password = obj["PassWord"].ToObject<string>();
            try
            {
                if (string.IsNullOrWhiteSpace(mobileNo))
                {
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message = "Mobile No should not be empty.",
                        }
                    );
                    return dto;
                }
                if (string.IsNullOrWhiteSpace(password))
                {
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message = "Password should not be empty.",
                        }
                    );
                    return dto;
                }
                var tempuser = dbContext
                    .Users.Where(x => x.UserTelNo.Equals(mobileNo))
                    .AsNoTracking()
                    .SingleOrDefault();
                if (tempuser == null)
                {
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = "Mobile No is not Found." }
                    );
                    return dto;
                }
                User users = dbContext
                    .Users.Where(x => x.UserTelNo.Equals(mobileNo))
                    .AsNoTracking()
                    .SingleOrDefault();

                var storedHashedPassword = StringToByteArray(users.Password);
                // Hash the input password with the retrieved salt
                var hashedInputPassword = HashPassword(password);
                if (hashedInputPassword.SequenceEqual(storedHashedPassword))
                {
                    var user = dbContext
                        .Users.Where(x => x.UserTelNo.Equals(mobileNo))
                        .AsNoTracking()
                        .SingleOrDefault();

                    dto.uRoleMap = dbContext
                        .UserRoleMaps.AsNoTracking()
                        .Where(x =>
                            x.UserId == tempuser.UserId && x.Status == 1 && x.IsDefault == true
                        )
                        .SingleOrDefault();

                    if (user.Status == 2)
                    {
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                ErrorNo = "VMS000",
                                Message = "User status 'In-active', please contact administrator.",
                            }
                        );
                        return dto;
                    }
                    if (user.IsBlocked == true)
                    {
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                ErrorNo = "VMS000",
                                Message = "User status 'In-block', please contact administrator.",
                            }
                        );
                        return dto;
                    }
                    dto.UserHeader = user;
                    if (
                        dto.UserHeader != null
                        && !string.IsNullOrEmpty(dto.UserHeader.UserImageName)
                    )
                    {
                        dto.UserHeader.UserImageUrl = "";
                        dto.UserHeader.UserImageUrl =
                            $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host.Value.ToString()}/upload/User/{dto.UserHeader.UserImageName}";
                    }
                    string rolename = dbContext
                        .Roles.Where(x => x.RoleId == dto.uRoleMap.RoleId)
                        .SingleOrDefault()
                        .RoleName;

                    UserCompanyMap userCompanyMap = dbContext
                        .UserCompanyMaps.AsNoTracking()
                        .Where(x => x.UserId == user.UserId && x.Status == 1 && x.IsDefault == true)
                        .SingleOrDefault();
                    Company userCompany = dbContext
                        .Companies.Where(c => c.CompanyId == userCompanyMap.CompanyId)
                        .SingleOrDefault();

                    Plant currentPlant = dbContext
                        .Plants.Where(x => x.PlantId == user.PlantId)
                        .SingleOrDefault();
                    JObject licRes = new JObject();
                    string apiresult = "";

                    if (
                        userCompany.CheckToken == null
                        || userCompany.CheckToken == ""
                        || currentPlant.CheckToken == null
                        || currentPlant.CheckToken == ""
                    )
                    {
                        dto.tranStatus.result = false;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                ErrorNo = "VMS000",
                                Title = "No License Key Found.",
                                Message =
                                    "No License has been Created. Please Contact your Administrator.",
                            }
                        );
                        return dto;
                    }
                    else
                    {
                        JObject checkObj = new JObject();
                        checkObj = new JObject
                        {
                            { "CheckToken", userCompany.CheckToken },
                            { "PlantCheckToken", currentPlant.CheckToken },
                        };

                        licRes = await commonService.GetLicData(checkObj);
                        if (
                            licRes == null
                            || licRes["transtatus"] == null
                            || !(bool)licRes["transtatus"]["result"]
                        )
                        {
                            dto.tranStatus.result = (bool)licRes?["transtatus"]?["result"];
                            dto.tranStatus.lstErrorItem.Add(
                                new ErrorItem
                                {
                                    ErrorNo = "VMS000",
                                    Title = licRes?["transtatus"]?["lstErrorItem"][0]?["Title"]?.ToString() ?? "Error Occurred",
                                    Message =
                                        licRes?["transtatus"]?["lstErrorItem"][0]["Message"]?.ToString()
                                        ?? "An unknown error occurred. Please contact support.",
                                }
                            );
                            return dto;
                        }
                        else 
                        {
                            apiresult = licRes.ToString();
                        }
                    }

                    dto.AuthToken = ITokenAuthService.Authentication(
                        dto.UserHeader,
                        userCompany,
                        rolename,
                        apiresult
                    );

                    dto = FetchSession(dto);
                    Log_LoginAttempt(dto.UserHeader, password);
                    if (dto.tranStatus.lstErrorItem.Count > 0)
                    {
                        return dto;
                    }
                    long Userid = dto.UserHeader.UserId;
                    int roleid = dto.uRoleMap.RoleId;
                    int companyid = userCompanyMap.CompanyId;
                    using (dapperContext)
                    {
                        var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                            spName: "SP_HOME_INITIALIZE",
                            new
                            {
                                Userid,
                                roleid,
                                companyid,
                            }
                        );
                        dto.companyList = await spcall.ReadAsync<dynamic>();
                        dto.userbranchmapList = await spcall.ReadAsync<dynamic>();
                        dto.userrolemapList = await spcall.ReadAsync<dynamic>();
                        dto.gateList = await spcall.ReadAsync<dynamic>();
                        dto.usermoduleList = await spcall.ReadAsync<dynamic>();
                        dto.userscreenmapList = await spcall.ReadAsync<dynamic>();
                    }
                    dto.tranStatus.result = true;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem { Message = "Something Went Wrong, Please Try Again." }
                    );

                    dto.tranStatus.result = true;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = "User data found." }
                    );
                    return dto;
                }
                else
                {
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = "Password is Incorrect." }
                    );
                    return dto;
                }
            }
            catch (Exception ex)
            {
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
                return dto;
            }
        }

        public static byte[] StringToByteArray(string hex)
        {
            var byteArray = new byte[hex.Length / 2];
            for (var i = 0; i < byteArray.Length; i++)
            {
                byteArray[i] = Convert.ToByte(hex.Substring(i * 2, 2), 16);
            }
            return byteArray;
        }

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

        public string ParseRequestHeader()
        {
            return httpContextAccessor.HttpContext.Request.Headers["Sessionid"];
        }

        public LoginDTO CreateSession(LoginDTO uContext)
        {
            try
            {
                string sessionId = ParseRequestHeader();

                if (!dbContext.UserSessions.Any(s => s.SessionId.Equals(sessionId)))
                {
                    dbContext.UserSessions.Add(
                        new UserSession
                        {
                            // UserSessionId = 0,
                            SessionId = sessionId,
                            LoggedUser = uContext.UserHeader.UserId,
                            LoggedRole = uContext.uRoleMap.RoleId,
                            LoggedInOn = DateTime.Now,
                            SessionStatus = 1,
                        }
                    );
                    dbContext.SaveChanges();
                }
                uContext.SessionID = sessionId;
                return uContext;
            }
            catch (Exception ex)
            {
                uContext.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
                return uContext;
            }
        }

        public LoginDTO FetchSession(LoginDTO uContext)
        {
            try
            {
                if (String.IsNullOrEmpty(uContext.SessionID))
                {
                    UserRoleMap uRoleMap = dbContext
                        .UserRoleMaps.AsNoTracking()
                        .SingleOrDefault(r =>
                            r.UserId == uContext.UserHeader.UserId
                            && r.Status == 1
                            && r.IsDefault == true
                        );
                    uContext.LoggedRole = dbContext
                        .Roles.AsNoTracking()
                        .SingleOrDefault(r => r.RoleId == uRoleMap.RoleId);
                    UserPlantMap Userplantmap = dbContext
                        .UserPlantMaps.AsNoTracking()
                        .SingleOrDefault(b =>
                            b.UserId == uContext.UserHeader.UserId
                            && b.Status == 1
                            && b.IsDefault == true
                        );
                    uContext.LoggedPlant = dbContext
                        .Plants.AsNoTracking()
                        .SingleOrDefault(r => r.PlantId == Userplantmap.PlantId);
                    uContext = CreateSession(uContext);
                }
                if (String.IsNullOrEmpty(uContext.SessionID))
                {
                    uContext.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = "Session Id is not valid." }
                    );
                    return uContext;
                }
                var userSession = dbContext
                    .UserSessions.AsNoTracking()
                    .SingleOrDefault(x =>
                        x.SessionId == uContext.SessionID && x.SessionStatus == 1
                    );
                if (userSession == null)
                {
                    uContext.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = "No Active Session found" }
                    );
                    return uContext;
                }
                if (uContext.UserHeader == null)
                {
                    uContext.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = "User does not exists." }
                    );
                    return uContext;
                }
                uContext.UserbranchmapviewList = dbContext
                    .UserPlantMapViews.AsNoTracking()
                    .Where(r => r.UserId == uContext.UserHeader.UserId && r.Status == 1)
                    .ToList();
                uContext.UserrolemapviewList = (
                    from r in dbContext.UserRoleMapViews.AsNoTracking()
                    where r.UserId == uContext.UserHeader.UserId && r.Status == 1
                    select r
                ).ToList();
                uContext.Userrolemappedfunctionsviews = (
                    from r in dbContext.UserRoleMappedFunctionViews.AsNoTracking()
                    where r.UserId == uContext.UserHeader.UserId //&& r.Roleid == userSession.Loggedrole
                    orderby r.ScreenOrder
                    select r
                ).ToList();
                uContext.UserHeader.UserRoleMaps = dbContext
                    .UserRoleMaps.AsNoTracking()
                    .Where(w => w.UserId == uContext.UserHeader.UserId)
                    .ToList();
                return uContext;
            }
            catch (Exception ex)
            {
                uContext.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
                return uContext;
            }
        }

        public void Log_LoginAttempt(User user, string enteredPassword)
        {
            var users = dbContext.Users.SingleOrDefault(s => s.UserName.Equals(user.UserName));
            if (users != null)
            {
                LoginHistory history = new LoginHistory()
                {
                    // LoginHistoryId = 0,
                    UserId = user.UserId,
                    Password = enteredPassword,
                    IsActive = true,
                };
                dbContext.LoginHistories.Add(history);
                dbContext.SaveChanges();
            }
        }

        public async Task<LoginDTO> LogOut(JObject obj)
        {
            dto.SessionID = obj["SessionId"].ToObject<string>();
            dto = CloseSession(dto);
            if (dto.tranStatus.lstErrorItem.Count > 0)
                return dto;

            dto.tranStatus.result = true;
            dto.tranStatus.lstErrorItem.Add(
                new ErrorItem { ErrorNo = "VMS000", Message = "Logged Out Successfully." }
            );

            return dto;
        }

        public LoginDTO CloseSession(LoginDTO uContext)
        {
            try
            {
                string sessionId = uContext.SessionID;

                UserSession session = dbContext
                    .UserSessions.Where(x => x.SessionId == sessionId)
                    .SingleOrDefault();

                if (session == null)
                {
                    uContext.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = "Session details not found." }
                    );

                    return uContext;
                }

                // session.LoggedOutOn = DateTime.Now;
                session.SessionStatus = 2;

                dbContext.UserSessions.Update(session);
                dbContext.SaveChanges();

                uContext.SessionID = sessionId;

                return uContext;
            }
            catch (Exception ex)
            {
                uContext.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
                return uContext;
            }
        }

        public async Task<LoginDTO> getHeaderGate(JObject obj)
        {
            try
            {
                long plantId = obj["PlantId"].ToObject<long>();
                dto.gateList = dbContext
                    .Gates.AsNoTracking()
                    .Where(x => x.PlantId == plantId && x.Status == 1)
                    .ToList();
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "Gate found." }
                );
                return dto;
            }
            catch (Exception ex)
            {
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
                return dto;
            }
        }
    }
}
