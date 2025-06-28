using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class RptCheckInCheckOutDTO
    {
        public ErrorContext transtatus { get; set; }

        public VisitorEntry HdrTable { get; set; }

        public List<Metadatum> StatusList { get; set; }

       public List<Plant> PlantList {get; set;}

        public List<VisitorEntry> VisitorList { get; set; }

         public List<Metadatum> VisitorTypeList { get; set; }

        public List<dynamic> CheckinCheckoutList { get; set; }

public List<Metadatum> PovList {get; set;}

    }
}