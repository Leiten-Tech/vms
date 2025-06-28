using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class CategoryCpMapDetail
    {
        public long CategoryCpMapDetailId { get; set; }
        public int CpMapId { get; set; }
        public int CategoryId { get; set; }
        public string Description { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public bool? IsSysGenerated { get; set; }

        public virtual CategoryCpMap CpMap { get; set; }
    }
}
