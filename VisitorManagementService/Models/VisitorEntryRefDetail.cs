using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VisitorEntryRefDetail
    {
        public long VisitorEntryRefDetailId { get; set; }
        public long? VisitorEntryId { get; set; }
        public long? RefTypeId { get; set; }
        public string RefValue { get; set; }

        public virtual VisitorEntry VisitorEntry { get; set; }
    }
}
