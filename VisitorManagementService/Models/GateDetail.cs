using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class GateDetail
    {
        public long GateDetailId { get; set; }
        public long SecurityId { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public long GateId { get; set; }
        public string Address { get; set; }

        public virtual Gate Gate { get; set; }
    }
}
