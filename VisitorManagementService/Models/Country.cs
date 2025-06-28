using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Country
    {
        public long CountryId { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; }
        public string CountryShortForm { get; set; }
        public string Nationality { get; set; }
        public int? Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
