using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
    public class StateDto
    {
        public List<State> StateMasterList { get; set; }
        public State HdrTable { get; set; }
        public List<Country> CountryList { get; set; }
        public List<dynamic> StateList { get; set; }
        public List<Metadatum> StatusList { get; set; }
        public ErrorContext transtatus { get; set; }
    }
}