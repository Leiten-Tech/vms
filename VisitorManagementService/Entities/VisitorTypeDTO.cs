using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class VisitorTypeDTO
    {
        public VisitorTypeDTO()
        {
        }

        public ErrorContext tranStatus { get; set; }
        public List<Metadatum> StatusList { get; set; }
        public VisitorType VisitorTypeHeader { get; set; }
        public List<dynamic> VisitorTypeList { get; set; }
    }
}