using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class JobCheckinCheckoutRptDTO
    {
        public ErrorContext transtatus { get; set; }

        public VisitorEntry HdrTable { get; set; }

        public List<dynamic> CheckinCheckoutList { get; set; }

    }
}