using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Userdevicetoken
    {
        public int Id { get; set; }
        public string MobileNumber { get; set; }
        public string DeviceToken { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
