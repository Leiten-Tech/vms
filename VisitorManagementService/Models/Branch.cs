using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Branch
    {
        public long BranchId { get; set; }
        public string BranchCode { get; set; }
        public string BranchName { get; set; }
        public int BranchType { get; set; }
        public string Address { get; set; }
        public string GeoLocation { get; set; }
        public long CountryId { get; set; }
        public long CityId { get; set; }
        public long StateId { get; set; }
        public long CompanyId { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string UrlToken { get; set; }
        public string CheckToken { get; set; }
        public bool? IsAutomaticApprove { get; set; }
    }
}
