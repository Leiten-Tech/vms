using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class City
    {
        public long CityId { get; set; }
        public long? CountryId { get; set; }
        public long? StateId { get; set; }
        public string CityName { get; set; }
        public string CityCode { get; set; }
        public long? CompanyId { get; set; }
        public long? PlantId { get; set; }
        public int? Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
