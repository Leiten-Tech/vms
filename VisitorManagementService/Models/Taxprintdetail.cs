using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Taxprintdetail
    {
        public long Taxprintid { get; set; }
        public long Structureid { get; set; }
        public long? Employeeid { get; set; }
        public string Employeename { get; set; }
        public string Contactno { get; set; }
        public long? Issuerempid { get; set; }
        public long? Issuerdesigid { get; set; }
        public bool? Isnewemployee { get; set; }
        public int? Status { get; set; }

        public virtual Taxstructure Structure { get; set; }
    }
}
