using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VisitorEntryAtvDetail
    {
        public long VisitorEntryAtvDetailId { get; set; }
        public long VisitorEntryId { get; set; }
        public long AreaToVisit { get; set; }

        public virtual VisitorEntry VisitorEntry { get; set; }
    }
}
