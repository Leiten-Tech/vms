using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Metadatum
    {
        public long MetaSubId { get; set; }
        public string MetaTypeCode { get; set; }
        public string MetaSubCode { get; set; }
        public string MetaTypeName { get; set; }
        public string MetaSubDescription { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
