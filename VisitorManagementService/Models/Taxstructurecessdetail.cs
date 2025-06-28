using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Taxstructurecessdetail
    {
        public long Cessdetailid { get; set; }
        public long Structureid { get; set; }
        public long Cessid { get; set; }
        public decimal Cesspercent { get; set; }
        public decimal Cessvalue { get; set; }

        public virtual Taxstructure Structure { get; set; }
    }
}
