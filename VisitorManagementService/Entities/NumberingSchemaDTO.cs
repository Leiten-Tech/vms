using VisitorManagementMySQL.Models;
using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
namespace VisitorManagementMySQL.Entities
{
    public class NumberingSchemaDTO
    {
        public List<Metadatum> StatusList { get; set; }
        public List<Metadatum> SymbolList { get; set; }
        public List<Metadatum> DateFormatList { get; set; }
        public List<Function> DocumentList { get; set; }
        public List<NumberingSchemaSearchView> NumberingSchemaViewList { get; set; }
        public NumberingSchema NumberingSchema { get; set; }
        public ErrorContext transtatus { get; set; }
    }
}