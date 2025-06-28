using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class CalendarDto
    {

        public List<dynamic> AppointmentList { get; set; }
  
        public ErrorContext transtatus { get; set; }

    }

    // public class AppointmentInfo 
    // {
        
    // }
}
