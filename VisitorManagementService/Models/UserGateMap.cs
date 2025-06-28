using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class UserGateMap
    {
        public long UserGateMapId { get; set; }
        public long CompanyId { get; set; }
        public long UserId { get; set; }
        public long PlantId { get; set; }
        public long GateId { get; set; }
        public int Status { get; set; }
        public int AccountingYear { get; set; }
        public bool? IsDefault { get; set; }

        public virtual User User { get; set; }
    }
}
