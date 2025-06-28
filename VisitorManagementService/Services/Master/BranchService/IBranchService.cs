using System;
using System.Collections.Generic;
using System.Linq;
using Entities;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.Branch
{
    public interface IBranchService
    {
         Task<object> CreateInitialize(JObject input);
          Task<object> Create(JObject input);
         Task<object> Update(JObject input);
         Task<object> ChangeStatus(JObject input);
         Task<object> SearchInitialize(JObject input);
    }
}