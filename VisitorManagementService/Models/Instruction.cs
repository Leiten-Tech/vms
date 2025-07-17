using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Instruction
    {
        public long InstructionsId { get; set; }
        public long? CompanyId { get; set; }
        public long? PlantId { get; set; }
        public string InstructionName { get; set; }
        public long VisitorTypeId { get; set; }
        public string Points { get; set; }
        public long Version { get; set; }
        public bool IsEnabled { get; set; }
        public int? Status { get; set; }
    }
}
