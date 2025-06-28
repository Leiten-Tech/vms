using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class UserView
    {
        public long UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public long CompanyId { get; set; }
        public long? PlantId { get; set; }
        public long? DefaultRoleId { get; set; }
        public string UserEmail { get; set; }
        public string UserTelNo { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string Defaultrolename { get; set; }
        public long Isdefaultbranchid { get; set; }
        public string Isdefaultbranchname { get; set; }
        public long Currentbranchid { get; set; }
        public string Currentbranchname { get; set; }
        public int Statusname { get; set; }
        public int Statusid { get; set; }
    }
}
