using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Taxsubstructuredetail
    {
        public long Subdetailid { get; set; }
        public long Structuredetailid { get; set; }
        public long Componentid { get; set; }
        public long Subcomponentid { get; set; }
        public int Operationid { get; set; }
        public int Calculationtypeid { get; set; }
        public string Amountformula { get; set; }
        public decimal? Formulaamount { get; set; }
        public decimal? Actualamount { get; set; }

        public virtual Taxstructuredetail Structuredetail { get; set; }
    }
}
