using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;
using System.Security.Cryptography.X509Certificates;

namespace VisitorManagementMySQL.Services.Master.PreviewPassService
{
    public class PreviewPassService : IPreviewPassService
    {
        private readonly PreviewPassDto dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        public PreviewPassService(DbContextHelper _dbContext, IDapperContext _dapperContext)
        {
            dto = new PreviewPassDto();
            DbContext = _dbContext;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }
        public async Task<object> CreateInitialize(JObject obj)
        {
            string Type = "CreateInitialize";
            long CompanyId = obj["CompanyId"].ToObject<long>();
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_PREVIEW_PASS", new
                    {
                        Type,
                        CompanyId
                    });
                    dto.PlantList = (await spcall.ReadAsync<dynamic>()).ToList();

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