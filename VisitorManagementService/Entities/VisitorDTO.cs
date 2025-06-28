using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class VisitorDTO
    {
        public ErrorContext tranStatus { get; set; }
        public List<Metadatum> VisitorTypeList { get; set; }
        public List<Metadatum> TitleList { get; set; }
        public List<Metadatum> IdCardList { get; set; }
        public List<Metadatum> StatusList { get; set; }
        public List<Metadatum> WorkSeverityList { get; set; }
        public List<Country> CountryList { get; set; }
        public List<State> StateList { get; set; }
        public List<City> CityList { get; set; }
        public List<Department> DepartmentList { get; set; }
        public Visitor VisitorHeader { get; set; }
        public List<Visitor> VisitorList { get; set; }
        public List<VisitorDetail> VisitorDetail { get; set; }
        public List<dynamic> VisitorSearchList { get; set; }
        public List<dynamic> VisitorTypeSearchList { get; set; }
        public List<dynamic> MobileExists { get; set; }
    }
}