using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class PatientDoc
    {
        public long PatientDocId { get; set; }
        public long PatientId { get; set; }
        public int? DocType { get; set; }
        public string DocName { get; set; }
        public string DocNo { get; set; }
        public string DocUrl { get; set; }
        public long Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public virtual Patient Patient { get; set; }
    }
}
