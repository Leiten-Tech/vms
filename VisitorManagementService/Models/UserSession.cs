using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class UserSession
    {
        public long UserSessionId { get; set; }
        public string SessionId { get; set; }
        public long LoggedUser { get; set; }
        public int LoggedRole { get; set; }
        public DateTime LoggedInOn { get; set; }
        public DateTime? LoggedOutOn { get; set; }
        public int SessionStatus { get; set; }
        public long? CompanyId { get; set; }
        public long? GateId { get; set; }
        public long? PlantId { get; set; }
        public bool AndroidUser { get; set; }
        public string Mobileno { get; set; }
    }
}
