using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Userrolemap1
    {
        public int? UserRoleMapId { get; set; }
        public int? CompanyId { get; set; }
        public int? UserId { get; set; }
        public int? RoleId { get; set; }
        public int? Status { get; set; }
        public int? AccountingYear { get; set; }
        public int? IsDefault { get; set; }
    }
}
