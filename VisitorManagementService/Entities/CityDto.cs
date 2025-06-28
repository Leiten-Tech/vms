using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
    public class CityDto
    {
        public List<City> CityMasterList { get; set; }
        public City HdrTable { get; set; }
        public List<Country> CountryList { get; set; }
        public List<Metadatum> StatusList { get; set; }
        public List<State> StateList { get; set; }
        public List<dynamic> CityList { get; set; }
        public List<State> OnChangeCountry { get; set; }
        public ErrorContext transtatus { get; set; }
    }
}