using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class UserBranchMap
    {
        public long UserBranchMapId { get; set; }
        public long CompanyId { get; set; }
        public long UserId { get; set; }
        public long PlantId { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public int AccountingYear { get; set; }
        public bool? IsDefault { get; set; }

        public virtual User User { get; set; }
    }
}
