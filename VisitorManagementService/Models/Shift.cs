using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Shift
    {
        public long ShiftId { get; set; }
        public string ShiftCode { get; set; }
        public long CompanyId { get; set; }
        public long PlantId { get; set; }
        public string ShiftName { get; set; }
        public string ShiftType { get; set; }
        public DateTime ShiftFromTime { get; set; }
        public DateTime ShiftToTime { get; set; }
        public decimal? ShiftHours { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
