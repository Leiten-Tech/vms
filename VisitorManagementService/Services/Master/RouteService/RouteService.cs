using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;

namespace VisitorManagementMySQL.Services.Master.RouteService
{
    public class RouteService : IRouteService
    {
        private readonly RouteDTO dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        public RouteService(DbContextHelper _dbContextHelper,
         IDapperContext _dapperContext
         )
        {
            dto = new RouteDTO();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();

        }
        public async Task<RouteDTO> CreateInitialize(JObject obj)
        {

            try
            {
                long RouteId = obj["RouteId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "CreateInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_ROUTE_CI", new
                    {
                        Type,
                        RouteId,
                        CompanyId,
                        RoleId,
                        PlantId
                        
                    });
                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.RouteList = (await spcall.ReadAsync<dynamic>()).ToList();
                    if (RouteId > 0)
                    {
                        dto.HdrTable = (await spcall.ReadAsync<Route>()).SingleOrDefault();
                    }

                }
                dto.transtatus.result = true;

            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }

            return dto;
        }
        public async Task<RouteDTO> Create(JObject obj)
        {

            try
            {
                Route Route = obj["Route"].ToObject<Route>();
                Route.RouteCode = await GenerateUniqueCode();
                var Routes = DbContext.Routes.Where(y => y.RouteName == Route.RouteName && y.CompanyId == Route.CompanyId).SingleOrDefault();
                var Routelocation = DbContext.Routes.Where(y => y.FromLocation == Route.FromLocation && y.ToLocation == Route.ToLocation && y.CompanyId == Route.CompanyId).ToList();
                if (Routes != null)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"Route Name :{Routes.RouteName} already exists. "
                       }
                   );
                    return dto;
                }
                if (Routelocation.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"Route already exists. "
                       }
                   );
                    return dto;
                }
                DbContext.Routes.Add(Route);
                await DbContext.SaveChangesAsync();
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(new ErrorItem
                {
                    Message = "Created Successfully"
                });
            }
            catch (Exception ex)
            {

                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }

            return dto;

        }
        public async Task<RouteDTO> Update(JObject obj)
        {
            try
            {

                Route Route = obj["Route"].ToObject<Route>();
                 var Routes = DbContext.Routes.Where(y => y.RouteName == Route.RouteName && y.RouteId != Route.RouteId && y.CompanyId == Route.CompanyId).SingleOrDefault();
                 var Routelocation = DbContext.Routes.Where(y => y.FromLocation == Route.FromLocation && y.ToLocation == Route.ToLocation & y.RouteId != Route.RouteId && y.CompanyId == Route.CompanyId).ToList();
                 if (Routes != null)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"Route Name :{Routes.RouteName} already exists. "
                       }
                   );
                    return dto;
                }
                if (Routelocation.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"Route already exists. "
                       }
                   );
                    return dto;
                }
                DbContext.Routes.Update(Route);
                await DbContext.SaveChangesAsync();
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                  new ErrorItem
                  {
                      Message = "Updated Successfully"
                  }
              );

            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }
            return dto;
        }
        public async Task<RouteDTO> ChangeStatus(JObject obj)
        {

            try
            {
                long RouteId = obj["RouteId"].ToObject<long>();
                Route Route = DbContext.Routes.Where(y => y.RouteId == RouteId).SingleOrDefault();
                Route.Status = 2;
                DbContext.Routes.Update(Route);
                await DbContext.SaveChangesAsync();
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "Status Changed Successfully"
                   }
               );

            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }
            return dto;
        }
        public async Task<RouteDTO> SearchInitialize(JObject obj)
        {

            try
            {
                long RouteId = obj["RouteId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "SearchInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_ROUTE_CI", new
                    {
                        Type,
                        RouteId,
                        CompanyId,
                        RoleId,
                        PlantId
                    });

                    dto.RouteList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.transtatus.result = true;


            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }

            return dto;
        }


        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "16";
            string series = "45";
            using (dapperContext)
            {
                var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "GetPrimaryKey", new
                {
                    documentid,
                    series
                });
                documentno = (await spcall.ReadAsync<string>()).SingleOrDefault();
            }
            return documentno;
        }
    }
}