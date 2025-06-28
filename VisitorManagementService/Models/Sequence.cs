using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Sequence
    {
        public string SequenceName { get; set; }
        public int NextVal { get; set; }
    }
}
