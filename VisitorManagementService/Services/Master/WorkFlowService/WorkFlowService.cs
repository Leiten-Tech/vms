using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;
using Microsoft.AspNetCore.Http;

namespace VisitorManagementMySQL.Services.Master.WorkFlowService
{
    public class WorkFlowService : IWorkFlowService
    {
        private readonly WorkFlowDTO dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
         private readonly IHttpContextAccessor httpContextAccessor;
        public WorkFlowService
        (
            DbContextHelper _dbContextHelper,
            IDapperContext _dapperContext,
            IHttpContextAccessor _httpContextAccessor
        )
        {
            dto = new WorkFlowDTO();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.tranStatus = new ErrorContext();
            dto.tranStatus.lstErrorItem = new List<ErrorItem>();
            httpContextAccessor = _httpContextAccessor;
        }
        public async Task<object> SearchInitialize(JObject obj)
        {
            long WorkFlowId = obj["WorkFlowId"].ToObject<long>();
            string Type = "SearchInitialize";
            long PlantId = obj["PlantId"].ToObject<long>();
            long UserId = obj["UserId"].ToObject<long>();
            long Status = obj["Status"].ToObject<long>();
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_WORKFLOW_CI", new
                    {
                        Type,
                        WorkFlowId,
                        PlantId,
                        UserId,
                        Status
                    });

                    dto.WorkFlowList = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.WorkFlowCountList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "Something Went Wrong, Please Try Again."
                   }
               );

            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }
            return dto;
        }
        public async Task<object> ApprovalView(JObject obj)
        {
            string VisitorEntryCode = obj["VisitorEntryCode"].ToObject<string>();
            string Type = "ApprovalView";
             string Scheme = httpContextAccessor.HttpContext.Request.Scheme + "://" + httpContextAccessor.HttpContext.Request.Host.Value.ToString() + "/upload/VisitorEntry/";
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_WORKFLOW_CI", new
                    {
                        Type,
                        VisitorEntryCode,
                        Scheme,
                        WorkFlowId=(object)null,
                        PlantId=(object)null,
                        UserId=(object)null,
                        Status=(object)null
                    });

                    dto.ApprovalViewList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "Something Went Wrong, Please Try Again."
                   }
               );

            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
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
