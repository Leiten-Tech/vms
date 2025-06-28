using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Vendor
    {
        public Vendor()
        {
            Vendoraccountdetails = new HashSet<Vendoraccountdetail>();
            Vendordocumentdetails = new HashSet<Vendordocumentdetail>();
            Vendoremployeedetails = new HashSet<Vendoremployeedetail>();
        }

        public int Vendorid { get; set; }
        public string Vendorcode { get; set; }
        public string Vendorname { get; set; }
        public long? Companyid { get; set; }
        public long? Branchid { get; set; }
        public string Contactperson { get; set; }
        public string Contactnumber { get; set; }
        public string Address { get; set; }
        public int? Countryid { get; set; }
        public int? Stateid { get; set; }
        public int? Cityid { get; set; }
        public string Email { get; set; }
        public string Pannumber { get; set; }
        public string Gstnumber { get; set; }
        public string Tannumber { get; set; }
        public int Status { get; set; }
        public int? Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }
        public byte[] Rv { get; set; }

        public virtual ICollection<Vendoraccountdetail> Vendoraccountdetails { get; set; }
        public virtual ICollection<Vendordocumentdetail> Vendordocumentdetails { get; set; }
        public virtual ICollection<Vendoremployeedetail> Vendoremployeedetails { get; set; }
    }
}
