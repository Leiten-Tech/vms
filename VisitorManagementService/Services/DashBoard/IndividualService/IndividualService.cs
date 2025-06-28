using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;

namespace VisitorManagementMySQL.Services.DashBoard.IndividualService
{
    public class IndividualService : IIndividualService
    {
        private readonly IndividualDashBoardDto dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        public IndividualService(DbContextHelper _dbContextHelper, IDapperContext _dapperContext)
        {
            dto = new IndividualDashBoardDto();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();

        }
        public async Task<object> SearchInitialize(JObject obj)
        {
            try
            {
                string Type = "SearchInitialize";
                long PlantId = obj["PlantId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long UserId = obj["UserId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long Header = obj["Header"].ToObject<long>();
                DateTime FDate = obj["FromDate"].ToObject<DateTime>();
                DateTime TDate = obj["ToDate"].ToObject<DateTime>();
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_INDIVIDUAL_DASHOARD_CI", new
                    {
                        Type,
                        FDate,
                        TDate,
                        PlantId,
                        UserId,
                        RoleId,
                        CompanyId,
                        StsId=(object)null,
                        Header
                    });
                    dto.VisitorList = (await spcall.ReadAsync<dynamic>()).ToList();
                    if (Header == 1)
                    {
                        dto.HeaderList = (await spcall.ReadAsync<dynamic>()).ToList();
                    }
                    dto.VisitorCountList = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    dto.ContractorCountList = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    dto.InvoicedCountList = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    dto.VehicleTripCountList = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    dto.WorkpermitCountList = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    dto.PurposeOfVisitList = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
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

        public async Task<object> DashboardOnclick(JObject obj)
        {
            try
            {
                string Type = "DashboardOnclick";
                long PlantId = obj["PlantId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long UserId = obj["UserId"].ToObject<long>();
                long StsId = obj["StsId"].ToObject<long>();
                DateTime FDate = obj["FromDate"].ToObject<DateTime>();
                DateTime TDate = obj["ToDate"].ToObject<DateTime>();
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_INDIVIDUAL_DASHOARD_CI", new
                    {
                        Type,
                        FDate,
                        TDate,
                        PlantId,
                        CompanyId,
                        UserId,
                        RoleId,
                        StsId,
                        Header=(object)null
                    });
                    dto.ViewList = (await spcall.ReadAsync<dynamic>()).ToList();
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