using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class NumberingSchemaSearchView
    {
        public int NumberingSchemaId { get; set; }
        public string FunctionName { get; set; }
        public int FunctionId { get; set; }
        public string Prefix { get; set; }
        public string Suffix { get; set; }
        public string StatusName { get; set; }
        public int? DateFormat { get; set; }
        public string DateFormatName { get; set; }
        public int? SymbolId { get; set; }
        public string SymbolName { get; set; }
        public int Status { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
