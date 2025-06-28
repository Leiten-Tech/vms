using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class UserCompanyMap
    {
        public long UserCompanyId { get; set; }
        public int CompanyId { get; set; }
        public long UserId { get; set; }
        public int Status { get; set; }
        public int AccountingYear { get; set; }
        public bool? IsDefault { get; set; }

        public virtual User User { get; set; }
    }
}
