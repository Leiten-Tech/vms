using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class MobAndroidUsersView
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Mobileno { get; set; }
        public string Emailid { get; set; }
        public string Type { get; set; }
        public string UserImageUrl { get; set; }
        public string UserImageName { get; set; }
        public string CompanyName { get; set; }
        public string CompanyId { get; set; }
    }
}
