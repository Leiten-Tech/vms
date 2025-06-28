using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;


namespace VisitorManagementMySQL.Services.Master.AreaService
{
    public class AreaService : IAreaService
    {
        private readonly AreaDTO dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        public AreaService(DbContextHelper _dbContextHelper,
         IDapperContext _dapperContext
         )
        {
            dto = new AreaDTO();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();

        }
        public async Task<object> CreateInitialize(JObject obj)
        {

            try
            {
                long AreaId = obj["AreaId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                string Type = "CreateInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_AREA_CI", new
                    {
                        Type,
                        AreaId,
                        CompanyId,
                        RoleId,
                        PlantId
                    });

                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.CompanyList = (await spcall.ReadAsync<Company>()).ToList();
                    dto.PlantList = (await spcall.ReadAsync<Plant>()).ToList();
                    if (AreaId > 0)
                    {
                        dto.HdrTable = (await spcall.ReadAsync<Area>()).SingleOrDefault();
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

        public async Task<Object> OnChangeCompany(JObject obj)
        {
            try
            {
                string CompanyId = obj["CompanyId"].ToObject<string>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "OnChangeCompany";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_AREA_CI", new
                    {
                        Type,
                        AreaId = (Object)null,
                        CompanyId,
                        RoleId,
                        PlantId
                    });
                    dto.PlantList = (await spcall.ReadAsync<Plant>()).ToList();
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
        public async Task<object> Create(JObject obj)
        {
            try
            {
                Area Area = obj["Area"].ToObject<Area>();
                long PlantId = (long)Area.PlantId;
                long CompanyId = (long)Area.CompanyId;
                Area.AreaCode = await GenerateUniqueCode();
                var Areas = DbContext.Areas.Where(y => y.AreaName == Area.AreaName && y.CompanyId.Equals(CompanyId) && y.PlantId.Equals(PlantId)).SingleOrDefault();
                if (Areas != null)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"Area Name :{Areas.AreaName} already exists. "
                       }
                   );
                    return dto;
                }

                DbContext.Areas.Add(Area);
                await DbContext.SaveChangesAsync();
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "Created Successfully"
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
        public async Task<object> Update(JObject obj)
        {
            try
            {

                Area Area = obj["Area"].ToObject<Area>();
                long PlantId = (long)Area.PlantId;
                long CompanyId = (long)Area.CompanyId;
                var Areas = DbContext.Areas.Where(y => y.AreaName == Area.AreaName & y.AreaId != Area.AreaId && y.CompanyId.Equals(CompanyId) && y.PlantId.Equals(PlantId)).SingleOrDefault();
                if (Areas != null)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"Area Name :{Areas.AreaName} already exists. "
                       }
                   );
                    return dto;
                }

                DbContext.Areas.Update(Area);
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
        public async Task<object> ChangeStatus(JObject obj)
        {

            try
            {
                long AreaId = obj["AreaId"].ToObject<long>();
                Area Area = DbContext.Areas.Where(y => y.AreaId == AreaId).SingleOrDefault();
                Area.Status = 2;
                DbContext.Areas.Update(Area);
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
        public async Task<object> SearchInitialize(JObject obj)
        {

            try
            {
                long AreaId = obj["AreaId"].ToObject<long>();
                string Type = "SearchInitialize";
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_AREA_CI", new
                    {
                        Type,
                        AreaId,
                        CompanyId,
                        RoleId,
                        PlantId
                    });

                    dto.AreaList = (await spcall.ReadAsync<dynamic>()).ToList();
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
            string documentid = "15";
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