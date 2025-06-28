using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Reports.RptCheckInCheckOutService
{
    public interface IRptCheckInCheckOutService
    {
        // Task<object> OnChangeVisitor(JObject input);
        
        Task<object> SearchInitialize(JObject input);

        Task<object> CreateInitialize(JObject input);
       

    }
}