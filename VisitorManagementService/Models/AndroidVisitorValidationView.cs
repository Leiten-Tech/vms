using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class AndroidVisitorValidationView
    {
        public string MobileNo { get; set; }
        public string VisitorEntryCode { get; set; }
        public long? CompanyId { get; set; }
    }
}
