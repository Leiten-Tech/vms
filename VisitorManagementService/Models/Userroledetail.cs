using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Userroledetail
    {
        public long Userroledtlid { get; set; }
        public long Userid { get; set; }
        public int Companyid { get; set; }
        public int Branchid { get; set; }
        public int Roleid { get; set; }
        public bool Isdefault { get; set; }
        public int? Status { get; set; }

        public virtual User User { get; set; }
    }
}
