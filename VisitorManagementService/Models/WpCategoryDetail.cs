using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class WpCategoryDetail
    {
        public long? CompanyId { get; set; }
        public long? PlantId { get; set; }
        public long? GateId { get; set; }
        public long WpCategoryDetailId { get; set; }
        public long WorkPermitId { get; set; }
        public long CategoryId { get; set; }
        public string CategoryName { get; set; }
        public long RemarkStatus { get; set; }

        public virtual WorkPermit WorkPermit { get; set; }
    }
}
