using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VisitorType
    {
        public long VisitorTypeId { get; set; }
        public string VisitorTypeCode { get; set; }
        public string VisitorTypeName { get; set; }
        public long CompanyId { get; set; }
        public long PlantId { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
