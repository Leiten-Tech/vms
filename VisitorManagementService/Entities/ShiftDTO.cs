using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class ShiftDTO
    {
         public ErrorContext transtatus { get; set; }
         public Shift HdrTable { get; set; }
          public List<dynamic> ShiftList { get; set; }
          public List<Metadatum> StatusList {get; set;} 
        
    }
}