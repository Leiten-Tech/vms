using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Salarystructureearning
    {
        public long Salstructdetailid { get; set; }
        public long Salstructid { get; set; }
        public string Earningcompcode { get; set; }
        public string Earningformula { get; set; }
        public string Earningformulavalue { get; set; }
        public decimal Earningsamount { get; set; }
        public int Status { get; set; }
        public long? Salcompid { get; set; }
        public bool? Istaxable { get; set; }

        public virtual Salarystructure Salstruct { get; set; }
    }
}
