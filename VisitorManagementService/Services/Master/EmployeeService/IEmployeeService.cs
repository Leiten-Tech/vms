using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.CommonInterface;
using System.Collections.Generic;
namespace VisitorManagementMySQL.Services.Master.EmployeeService
{
    public interface IEmployeeService : BasicInterface
    {
        Task<object> Create(object obj, IFormFile webfile,List<IFormFile> webfiles);
        Task<object> Update(object obj, IFormFile webfile,List<IFormFile> webfiles);
    }
}