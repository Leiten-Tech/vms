using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class FeedbackDetail
    {
        public long FeedbackDetailId { get; set; }
        public long? CompanyId { get; set; }
        public long? PlantId { get; set; }
        public long? FeedbackId { get; set; }
        public long? FeedbackType { get; set; }
        public long? StarRating { get; set; }
        public int? Status { get; set; }

        public virtual Feedback Feedback { get; set; }
    }
}
