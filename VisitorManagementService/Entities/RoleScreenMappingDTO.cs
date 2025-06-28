using System.Collections.Generic;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class RoleScreenMappingDTO
    {
        public List<Function> ModuleList { get; set; }
        public List<UserView> UserList { get; set; }
        public ErrorContext transtatus { get; set; }
        public List<Role> RoleMasterList { get; set; }
        public List<RoleWiseScreenMappingView> RolewiseScreenMappingViewList { get; set; }
        public List<RoleWiseScreenMappingView> AllScreens { get; set; }
    }
}