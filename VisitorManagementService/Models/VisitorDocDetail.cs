using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VisitorDocDetail
    {
        public int VisitorDocId { get; set; }
        public long VisitorId { get; set; }
        public string IdCardType { get; set; }
        public string IdCardNo { get; set; }
        public string IdCardUrl { get; set; }
        public int Status { get; set; }
        public string IdCardName { get; set; }

        public virtual Visitor Visitor { get; set; }
    }
}
