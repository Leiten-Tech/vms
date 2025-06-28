using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
    public class CustomerDto
    {
        public List<Customer> CustomerMasterList { get; set; }
        public Customer HdrTable {get;set; }
        public List<Country> CountryList {get;set; }
        public List<Metadatum> StatusList {get;set; }
        public List<State> StateList {get;set; }
        public List<City> CityList {get;set; }
        public List<dynamic> CustomerList {get;set; }
        
        public List<State> OnChangeCountry {get;set; }
        public List<City> OnChangeState {get;set; }
		public ErrorContext transtatus { get; set; }

    }
}