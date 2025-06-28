using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VisitorEntryPovDetail
    {
        public long VisitorEntryPovDetailId { get; set; }
        public long VisitorEntryId { get; set; }
        public int PurposeOfVisit { get; set; }

        public virtual VisitorEntry VisitorEntry { get; set; }
    }
}
