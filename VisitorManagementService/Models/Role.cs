using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Role
    {
        public long RoleId { get; set; }
        public string RoleCode { get; set; }
        public string RoleName { get; set; }
        public long? CompanyId { get; set; }
        public long? PlantId { get; set; }
        public int? Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public bool? IsDesignation { get; set; }
        public bool? IsSystemGenerated { get; set; }
    }
}
