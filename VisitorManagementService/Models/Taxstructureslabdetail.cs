using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Taxstructureslabdetail
    {
        public long Slabdetailid { get; set; }
        public long Structureid { get; set; }
        public long Slabid { get; set; }
        public decimal Slabfrom { get; set; }
        public decimal Slabto { get; set; }
        public decimal Taxpercent { get; set; }
        public decimal Taxamount { get; set; }

        public virtual Taxstructure Structure { get; set; }
    }
}
