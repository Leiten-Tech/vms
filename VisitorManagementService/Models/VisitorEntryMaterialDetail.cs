using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VisitorEntryMaterialDetail
    {
        public long VisitorEntryMaterialDetailId { get; set; }
        public long VisitorEntryId { get; set; }
        public long MaterialId { get; set; }
        public int Uom { get; set; }
        public string Qty { get; set; }

        public virtual VisitorEntry VisitorEntry { get; set; }
    }
}
