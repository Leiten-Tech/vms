using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class EventTermsCondition
    {
        public long EventTcId { get; set; }
        public string EventTcName { get; set; }
        public int PolicyGroupId { get; set; }
        public string EventTcDescription { get; set; }
        public int? Status { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
