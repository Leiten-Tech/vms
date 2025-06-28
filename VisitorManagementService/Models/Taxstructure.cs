using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Taxstructure
    {
        public Taxstructure()
        {
            Taxamountdetails = new HashSet<Taxamountdetail>();
            Taxprintdetails = new HashSet<Taxprintdetail>();
            Taxstructurecessdetails = new HashSet<Taxstructurecessdetail>();
            Taxstructuredetails = new HashSet<Taxstructuredetail>();
            Taxstructurerebatedetails = new HashSet<Taxstructurerebatedetail>();
            Taxstructureslabdetails = new HashSet<Taxstructureslabdetail>();
        }

        public long Structureid { get; set; }
        public string Structurecode { get; set; }
        public string Structurename { get; set; }
        public int Regimeid { get; set; }
        public long Salaryid { get; set; }
        public decimal Grosssalary { get; set; }
        public decimal Totaldeductionamount { get; set; }
        public decimal Taxbeforeslab { get; set; }
        public decimal Totalslabamount { get; set; }
        public decimal Totalcess { get; set; }
        public decimal Totaltaxpayable { get; set; }
        public int Status { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public int Accountingyear { get; set; }
        public byte[] Rv { get; set; }
        public int Companyid { get; set; }
        public int Branchid { get; set; }

        public virtual ICollection<Taxamountdetail> Taxamountdetails { get; set; }
        public virtual ICollection<Taxprintdetail> Taxprintdetails { get; set; }
        public virtual ICollection<Taxstructurecessdetail> Taxstructurecessdetails { get; set; }
        public virtual ICollection<Taxstructuredetail> Taxstructuredetails { get; set; }
        public virtual ICollection<Taxstructurerebatedetail> Taxstructurerebatedetails { get; set; }
        public virtual ICollection<Taxstructureslabdetail> Taxstructureslabdetails { get; set; }
    }
}
