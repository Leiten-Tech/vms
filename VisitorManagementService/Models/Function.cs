using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Function
    {
        public int FunctionId { get; set; }
        public string FunctionName { get; set; }
        public string FunctionUrl { get; set; }
        public int ParentId { get; set; }
        public short FunctionStatus { get; set; }
        public int ScreenOrder { get; set; }
        public bool IsExternal { get; set; }
        public int IsApprovalNeeded { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string MenuIcon { get; set; }
        public string RelLink { get; set; }
    }
}
