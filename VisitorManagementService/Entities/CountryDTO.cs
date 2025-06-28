using System.Collections.Generic;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;
namespace VisitorManagementMySQL.Entities
{
    public class CountryDTO
    {
        public Country Country { get; set; }
        public List<dynamic> CountryList { get; set; }
        public List<Country> Countries { get; set; }
        public List<Metadatum> StatusList { get; set; }
        public ErrorContext transtatus { get; set; }
    }
}