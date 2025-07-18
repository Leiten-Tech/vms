using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class EmployeeMealDetail
    {
        public long EmployeeMealDetailId { get; set; }
        public long EmployeeId { get; set; }
        public string MealType { get; set; }
        public string EmployeeMealCount { get; set; }
        public string GuestMealCount { get; set; }

        public virtual Employee Employee { get; set; }
    }
}
