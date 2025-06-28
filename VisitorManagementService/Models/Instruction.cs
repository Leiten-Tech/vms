using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Instruction
    {
        public long InstructionsId { get; set; }
        public int? CompanyId { get; set; }
        public int? PlantId { get; set; }
        public long VisitorTypeId { get; set; }
        public string Points { get; set; }
        public int? Status { get; set; }
        public long Version { get; set; }
        public bool IsEnabled { get; set; }
        public string InstructionName { get; set; }
    }
}
