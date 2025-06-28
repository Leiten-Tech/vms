using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class State
    {
        public long StateId { get; set; }
        public long CountryId { get; set; }
        public string StateName { get; set; }
        public string StateCode { get; set; }
        public int? Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
