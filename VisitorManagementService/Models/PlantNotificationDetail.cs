using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class PlantNotificationDetail
    {
        public long PlantNotificationDetailId { get; set; }
        public long PlantId { get; set; }
        public int? LevelId { get; set; }
        public long? DepartmentId { get; set; }
        public long? PrimaryUserId { get; set; }
        public long? SecondaryUserId { get; set; }

        public virtual Plant Plant { get; set; }
    }
}
