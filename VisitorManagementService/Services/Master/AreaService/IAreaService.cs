using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.AreaService
{
    public interface IAreaService
    {
        Task<object> CreateInitialize(JObject input);
        Task<object> Create(JObject input);
        Task<object> Update(JObject input);
        Task<object> ChangeStatus(JObject input);
        Task<object> SearchInitialize(JObject input);
        Task<object> OnChangeCompany(JObject input);

    }
}