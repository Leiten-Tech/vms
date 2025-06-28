using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class EventCategory
    {
        public long EventCategoryId { get; set; }
        public string EventCategoryName { get; set; }
        public string EventCategoryImageName { get; set; }
        public string EventCategoryImageUrl { get; set; }
        public int Status { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
