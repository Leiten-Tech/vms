using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Entities;

namespace VisitorManagementMySQL.Services.Master.RouteService
{
    public interface IRouteService
    {
        Task<RouteDTO> CreateInitialize(JObject input);
        Task<RouteDTO> Create(JObject input);
        Task<RouteDTO> Update(JObject input);
        Task<RouteDTO> ChangeStatus(JObject input);
        Task<RouteDTO> SearchInitialize(JObject input);

    }
}