using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class RoleWiseScreenMappingView
    {
        public long? RoleId { get; set; }
        public int ScreenId { get; set; }
        public string ScreenName { get; set; }
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
    }
}
