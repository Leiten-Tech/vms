using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Taxdetail
    {
        public long Taxdetailid { get; set; }
        public long Taxid { get; set; }
        public long Componentid { get; set; }
        public long Subcomponentid { get; set; }
        public int Calculationtypeid { get; set; }
        public string Amountformula { get; set; }
        public int? Status { get; set; }

        public virtual Tax Tax { get; set; }
    }
}
