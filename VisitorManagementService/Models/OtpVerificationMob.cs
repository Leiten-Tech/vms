using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class OtpVerificationMob
    {
        public long VerificationId { get; set; }
        public string VerificationType { get; set; }
        public string VerificationNo { get; set; }
        public string OtpCode { get; set; }
        public DateTime ExpiryAt { get; set; }
        public byte Status { get; set; }
    }
}
