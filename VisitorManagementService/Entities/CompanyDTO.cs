using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
  public class CompanyDto
  {
    public Company HdrTable { get; set; }
    public ErrorContext transtatus { get; set; }
    public List<Country> CountryList { get; set; }
    public List<State> StateList { get; set; }

    public List<City> CityList { get; set; }
    public List<dynamic> CompanyList { get; set; }
    public List<Metadatum> StatusList { get; set; }
  }
}