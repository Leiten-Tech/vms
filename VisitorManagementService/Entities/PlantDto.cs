using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
    public class PlantDto
    {
        public List<Plant> PlantMasterList { get; set; }
        public Plant HdrTable { get; set; }
        public List<dynamic> PlantList { get; set; }
        public List<Metadatum> StatusList { get; set; }
        public List<Metadatum> PlantTypeList { get; set; }
        public List<Company> CompanyList { get; set; }
        public List<Country> CountryList { get; set; }
        public List<State> StateList { get; set; }
        
        public List<City> CityList { get; set; }
        public ErrorContext transtatus { get; set; }
    }

}