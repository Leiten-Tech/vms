using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Visitor
    {
        public Visitor()
        {
            VisitorDetails = new HashSet<VisitorDetail>();
            VisitorDocDetails = new HashSet<VisitorDocDetail>();
        }

        public long VisitorId { get; set; }
        public string VisitorCode { get; set; }
        public long VisitorTypeId { get; set; }
        public long CompanyId { get; set; }
        public long PlantId { get; set; }
        public long? CountryId { get; set; }
        public long? StateId { get; set; }
        public long? CityId { get; set; }
        public int TitleId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime Dob { get; set; }
        public string VisitorCompany { get; set; }
        public string Address { get; set; }
        public string MailId { get; set; }
        public string MobileNo { get; set; }
        public int? IdCardType { get; set; }
        public string IdCardNo { get; set; }
        public string DocumentName { get; set; }
        public string DocumentUrl { get; set; }
        public string VisitorDocumentName { get; set; }
        public string VisitorDocumentUrl { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public long? AadharNo { get; set; }

        public virtual ICollection<VisitorDetail> VisitorDetails { get; set; }
        public virtual ICollection<VisitorDocDetail> VisitorDocDetails { get; set; }
    }
}
