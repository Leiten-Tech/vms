using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VisitorDetail
    {
        public long VisitorDetailId { get; set; }
        public long VisitorId { get; set; }
        public string VisitorDetailCode { get; set; }
        public int TitleId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public long? DepartmentId { get; set; }
        public DateTime? Dob { get; set; }
        public string MailId { get; set; }
        public string MobileNo { get; set; }
        public string VisitorCompany { get; set; }
        public string TagNo { get; set; }
        public int IdCardType { get; set; }
        public string IdCardNo { get; set; }
        public string DocumentName { get; set; }
        public string DocumentUrl { get; set; }
        public string DigitalSignName { get; set; }
        public string DigitalSignUrl { get; set; }
        public long SignedVersion { get; set; }
        public bool IsTermsAgreed { get; set; }
        public DateTime? ExpirryDate { get; set; }
        public int? WorkSeverity { get; set; }
        public int Status { get; set; }
        public long? AadharNo { get; set; }

        public virtual Visitor Visitor { get; set; }
    }
}
