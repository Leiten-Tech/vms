using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Taxstructuredetail
    {
        public Taxstructuredetail()
        {
            Taxsubstructuredetails = new HashSet<Taxsubstructuredetail>();
        }

        public long Structuredetailid { get; set; }
        public long Structureid { get; set; }
        public long Componentid { get; set; }
        public int Operationid { get; set; }
        public int Calculationtypeid { get; set; }
        public string Amountformula { get; set; }
        public decimal Maxamount { get; set; }
        public decimal? Actualamount { get; set; }

        public virtual Taxstructure Structure { get; set; }
        public virtual ICollection<Taxsubstructuredetail> Taxsubstructuredetails { get; set; }
    }
}
