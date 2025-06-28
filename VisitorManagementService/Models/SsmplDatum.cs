using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class SsmplDatum
    {
        public int? UserId { get; set; }
        public string UserCode { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public int? CompanyId { get; set; }
        public int? PlantId { get; set; }
        public int? DefaultRoleId { get; set; }
        public string UserEmail { get; set; }
        public int? Status { get; set; }
        public int? CreatedBy { get; set; }
        public string CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public string ModifiedOn { get; set; }
        public int? IsBlocked { get; set; }
        public string UserImageName { get; set; }
        public string UserImageUrl { get; set; }
        public int? GateId { get; set; }
        public string SecondaryMobileNo { get; set; }
        public string Address { get; set; }
        public int? DeptId { get; set; }
        public double? UserTelNo { get; set; }
        public string DigitalSign { get; set; }
        public string DigitalSignName { get; set; }
    }
}
