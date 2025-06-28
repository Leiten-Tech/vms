using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class UserPlantMapView
    {
        public long UserId { get; set; }
        public string UserName { get; set; }
        public long PlantId { get; set; }
        public string PlantName { get; set; }
        public bool? IsDefault { get; set; }
        public int Status { get; set; }
    }
}
