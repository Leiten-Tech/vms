using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class LoginHistory
    {
        public long LoginHistoryId { get; set; }
        public long UserId { get; set; }
        public string Password { get; set; }
        public bool IsActive { get; set; }
    }
}
