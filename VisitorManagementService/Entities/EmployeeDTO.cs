using System.Collections.Generic;
using  VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;
namespace VisitorManagementMySQL.Entities
{
    public class  EmployeeDTO
    {
    public List<Metadatum> EmployeeStatus {get;set;}
    public Employee Employee {get;set;}    
    public List<dynamic> EmployeeList {get;set;}    
    public List<Metadatum> StatusList {get;set;}    
    public List<Role> RoleList {get;set;}    
    public List<Department> DepartmentList {get;set;}    
    public List<Metadatum> GenderList {get;set;}    
    public List<Metadatum> MaritalStatusList {get;set;}    
    public List<Metadatum> EmployeeTypeList {get;set;}    
    public List<Metadatum> BloodGroupList {get;set;}     
    public List<Employee> ReportingPersonList {get;set;}     
    public List<EmployeeDocumentDetail> EmployeeDocumentDetailList {get;set;}     
    public Employee HdrTable { get; set; }
    public ErrorContext transtatus { get; set; }
    }
}