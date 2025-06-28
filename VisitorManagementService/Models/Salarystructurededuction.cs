using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Salarystructurededuction
    {
        public long Salstructdetailid { get; set; }
        public long Salstructid { get; set; }
        public string Deductioncompcode { get; set; }
        public string Deductionformula { get; set; }
        public string Deductionformulavalue { get; set; }
        public decimal Deductionamount { get; set; }
        public int Status { get; set; }
        public long? Salcompid { get; set; }
        public bool? Istaxable { get; set; }

        public virtual Salarystructure Salstruct { get; set; }
    }
}
