using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Taxstructurerebatedetail
    {
        public long Rebatedetailid { get; set; }
        public long Structureid { get; set; }
        public long Rebateid { get; set; }
        public decimal Rebatevalue { get; set; }
        public decimal Rebatemaxupto { get; set; }

        public virtual Taxstructure Structure { get; set; }
    }
}
