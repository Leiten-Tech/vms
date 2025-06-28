using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class UserRoleMapView
    {
        public long UserId { get; set; }
        public string UserName { get; set; }
        public long RoleId { get; set; }
        public string RoleName { get; set; }
        public bool? IsDefault { get; set; }
        public int Status { get; set; }
    }
}
