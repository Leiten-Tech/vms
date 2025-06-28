using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class AndroidUser
    {
        public long UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Mobileno { get; set; }
        public string Emailid { get; set; }
        public string CompanyName { get; set; }
        public int Status { get; set; }
        public string UserImageUrl { get; set; }
        public string UserImageName { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public bool Verified { get; set; }
    }
}
