using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VisitorEntryDetail
    {
        public long VisitorEntryDetailId { get; set; }
        public long VisitorEntryId { get; set; }
        public string VisitorEntryDetailCode { get; set; }
        public int VisitorId { get; set; }
        public int? TitleId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public long? DepartmentId { get; set; }
        public DateTime? Dob { get; set; }
        public string MailId { get; set; }
        public string MobileNo { get; set; }
        public int? IdCardType { get; set; }
        public string IdCardNo { get; set; }
        public string DocumentName { get; set; }
        public string DocumentUrl { get; set; }
        public int Status { get; set; }
        public bool? IsEditedImage { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public string DigitalSignName { get; set; }
        public string DigitalSignUrl { get; set; }
        public long SignedVersion { get; set; }
        public bool IsTermsAgreed { get; set; }
        public string TagNo { get; set; }
        public string VisitorCompany { get; set; }

        public virtual VisitorEntry VisitorEntry { get; set; }
    }
}
