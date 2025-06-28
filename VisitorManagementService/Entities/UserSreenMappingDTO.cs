using System;
using System.Collections.Generic;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class UserSreenMappingDTO
    {
        public List<Function> ModuleList { get; set; }
        public List<dynamic> UserList { get; set; }
        public List<dynamic> UserScreens { get; set; }
        public List<Role> RoleMasterList { get; set; }
        public ErrorContext transtatus { get; set; }
    }
}