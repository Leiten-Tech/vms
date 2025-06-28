using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class SupplierDTO
    {
        public ErrorContext tranStatus {get; set; }
        
        public Supplier HdrTable {get; set; }
        
        // public List<SupplierBillingDetail> DtlTable { get; set; }
        public List<dynamic> SupplierList { get;  set; }
        public List<Metadatum> StatusList {get; set; }
        public List<Metadatum> CategoryList { get;  set; }
        public List<Metadatum> SupplierTypeList { get; set; }
         public List<Country> CountryList { get; set; }
          public List<State> StateList { get; set; }
          public List<City> CityList { get; set; }
       
    }
}