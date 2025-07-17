using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class LoginDTO
    {
        public ErrorContext tranStatus { get; set; }
        public UserRoleMap uRoleMap { get; set; }
        public User UserHeader { get; set; }
        public List<UserPlantMapView> UserbranchmapviewList { get; set; }
        public List<UserRoleMapView> UserrolemapviewList { get; set; }
        public List<UserRoleMappedFunctionView> Userrolemappedfunctionsviews { get; set; }
        public string AuthToken { get; set; }
        public string SessionID { get; set; }
        public Role LoggedRole { get; set; }
        public Plant LoggedPlant { get; set; }
        public dynamic companyList { get; set; }
        public dynamic gateList { get; set; }
        public dynamic userbranchmapList { get; set; }
        public dynamic userrolemapList { get; set; }
        public dynamic usermoduleList { get; set; }
        public dynamic userscreenmapList { get; set; }
        //******Start *****Android App
        public string mobileno { get; set; }
        public string password { get; set; }
        public long Userid { get; set; }
        public string OTP { get; set; }
        public bool isalready { get; set; }
        public MobAndroidUsersView mobandroiduserdetails { get; set; }
        public List<MobAndroidUsersView> userdetails { get; set; }

    }
    public class ChangePasswordRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    // DeviceTokenDTO.cs
    public class DeviceTokenDTO
    {
        public string MobileNumber { get; set; }
        public string DeviceToken { get; set; }
    }
    
    //****End*******Android App
}
