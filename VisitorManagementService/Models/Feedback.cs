using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Feedback
    {
        public Feedback()
        {
            FeedbackDetails = new HashSet<FeedbackDetail>();
        }

        public long FeedbackId { get; set; }
        public string FeedbackCode { get; set; }
        public string FeedbackDesc { get; set; }
        public long? UserId { get; set; }
        public long? CompanyId { get; set; }
        public long? PlantId { get; set; }
        public int? Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public virtual ICollection<FeedbackDetail> FeedbackDetails { get; set; }
    }
}
