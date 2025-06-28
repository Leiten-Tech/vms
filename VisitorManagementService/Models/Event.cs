using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Event
    {
        public Event()
        {
            EventDocumentDetails = new HashSet<EventDocumentDetail>();
        }

        public long EventId { get; set; }
        public long HostId { get; set; }
        public string EventCode { get; set; }
        public int EventTypeId { get; set; }
        public int EventVisibilityId { get; set; }
        public long EventCategoryId { get; set; }
        public long EventTcId { get; set; }
        public int PolicyGroupId { get; set; }
        public string EventName { get; set; }
        public string EventDescription { get; set; }
        public DateTime EventStartDate { get; set; }
        public DateTime EventEndDate { get; set; }
        public string EventLocation { get; set; }
        public int MaxVisitors { get; set; }
        public int? ApprovedBy { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public string ApprovalRemarks { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public int AccountingYear { get; set; }

        public virtual ICollection<EventDocumentDetail> EventDocumentDetails { get; set; }
    }
}
