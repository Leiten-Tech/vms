using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Shiftbranchdetail
    {
        public int Shiftbranchid { get; set; }
        public int Shiftid { get; set; }
        public int Companyid { get; set; }
        public int Branchid { get; set; }
        public int Status { get; set; }

        public virtual Shift Shift { get; set; }
    }
}
