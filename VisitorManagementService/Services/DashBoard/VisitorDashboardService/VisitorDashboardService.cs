using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementService.Services.VisitorReportScheduler;
using Microsoft.Extensions.Logging;


namespace VisitorManagementMySQL.Services.DashBoard.VisitorDashboardService
{
    public class VisitorDashboardService : IVisitorDashboardService
    {
        private readonly VisitorDashboardDTO dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;


        public VisitorDashboardService(DbContextHelper _dbContextHelper, IDapperContext _dapperContext, ILogger<VisitorReportHostedJob> logger,
            IServiceProvider serviceProvider)
        {
            dto = new VisitorDashboardDTO();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }

        public async Task<object> SearchInitialize(JObject obj)
        {
            try
            {
                string Type = "GetVisitorDetail";

                long CompanyId = obj["CompanyId"].ToObject<long>();
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_VISITOR_DASHBOARD", new
                    {
                        Type,
                        CompanyId,
                    });
                    dto.VisitorList = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.VechicleList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                  new ErrorItem
                  {
                      Message = "Something Went Wrong, Please Try Again."
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
    }
}