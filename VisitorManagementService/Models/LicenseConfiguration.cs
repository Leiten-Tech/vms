using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class LicenseConfiguration
    {
        public long LicenseId { get; set; }
        public long CompanyId { get; set; }
        public string CompanyCode { get; set; }
        public string CompanyName { get; set; }
        public DateTime TrialStartDate { get; set; }
        public DateTime TrialEndDate { get; set; }
        public long TrialTotalDays { get; set; }
        public bool IsWaApprovalEnabled { get; set; }
        public bool IsEmApprovalEnabled { get; set; }
        public string LicenseToken { get; set; }
        public int Status { get; set; }
    }
}
