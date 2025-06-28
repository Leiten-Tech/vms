using System.Collections.Generic;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;


namespace VisitorManagementMySQL.Entities
{
    public class CategoryCPMappingDto
    {
        //public List<Metadatum> StatusList { get; set; }

        public ErrorContext tranStatus { get; set; }
        public List<Category> CategoryList { get; set; }
        public List<dynamic> CategoryMapList { get; set; }
        public List<dynamic> CategoryMapDetailList { get; set; }
        public List<dynamic> CategoryCPMapList { get; set; }
        public List<Metadatum> StatusList { get; set; }

        
    }
}