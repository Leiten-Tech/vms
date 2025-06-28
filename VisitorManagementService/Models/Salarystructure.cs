using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Salarystructure
    {
        public Salarystructure()
        {
            Salarystructuredeductions = new HashSet<Salarystructurededuction>();
            Salarystructureearnings = new HashSet<Salarystructureearning>();
            Salarystructureprints = new HashSet<Salarystructureprint>();
        }

        public int Companyid { get; set; }
        public int Branchid { get; set; }
        public long Salstructid { get; set; }
        public string Salstruccode { get; set; }
        public string Salstructname { get; set; }
        public decimal Grossamount { get; set; }
        public int Status { get; set; }
        public decimal Totalearningsamount { get; set; }
        public decimal Totaldeductionamount { get; set; }
        public decimal Netamount { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }

        public virtual ICollection<Salarystructurededuction> Salarystructuredeductions { get; set; }
        public virtual ICollection<Salarystructureearning> Salarystructureearnings { get; set; }
        public virtual ICollection<Salarystructureprint> Salarystructureprints { get; set; }
    }
}
