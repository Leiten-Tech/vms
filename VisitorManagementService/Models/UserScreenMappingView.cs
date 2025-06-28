using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class UserScreenMappingView
    {
        public int Companyid { get; set; }
        public int? Create { get; set; }
        public int? View { get; set; }
        public int? Print { get; set; }
        public int? Delete { get; set; }
        public int? Update { get; set; }
        public int Roleid { get; set; }
        public int Screenid { get; set; }
        public string Screenname { get; set; }
        public int Moduleid { get; set; }
        public string Modulename { get; set; }
        public int Status { get; set; }
    }
}
