using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Taxamountdetail
    {
        public long Taxamountid { get; set; }
        public long Structureid { get; set; }
        public int Tdstypeid { get; set; }
        public decimal? Jan { get; set; }
        public decimal? Feb { get; set; }
        public decimal? March { get; set; }
        public decimal? April { get; set; }
        public decimal? May { get; set; }
        public decimal? June { get; set; }
        public decimal? July { get; set; }
        public decimal? Aug { get; set; }
        public decimal? Sep { get; set; }
        public decimal? Oct { get; set; }
        public decimal? Nov { get; set; }
        public decimal? Decm { get; set; }
        public decimal? Totalamount { get; set; }

        public virtual Taxstructure Structure { get; set; }
    }
}
