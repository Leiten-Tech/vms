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
    }
}
