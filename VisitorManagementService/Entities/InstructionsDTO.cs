using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
    public class InstructionsDTO
    {

        public Instruction HdrTable { get; set; }

        public List<dynamic> InstructionsList {get; set;}

        public ErrorContext transtatus { get; set; }

        public List<Plant> PlantList { get; set; }

        public List<dynamic> VisitorTypeList { get; set; }

        public List<dynamic> CompanyList { get; set; }
        public List<Metadatum> StatusList { get; set; }
    }
}