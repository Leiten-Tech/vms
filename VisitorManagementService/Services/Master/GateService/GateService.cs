using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;
using System.Runtime.CompilerServices;

namespace VisitorManagementMySQL.Services.Master.GateService
{
    public class GateService : IGateService
    {
        private readonly GateDto dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        public GateService(DbContextHelper _dbContextHelper, IDapperContext _dapperContext)
        {
            dto = new GateDto();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }
        public async Task<object> CreateInitialize(JObject obj)
        {
            try
            {
                int GateId = obj["GateId"].ToObject<int>();
                string Type = "CreateInitialize";
                int CompanyId = obj["CompanyId"].ToObject<int>();
                int RoleId = obj["RoleId"].ToObject<int>();
                long PlantId = obj["PlantId"].ToObject<long>();
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_GATE_CI", new
                    {
                        Type,
                        GateId,
                        CompanyId,
                        PlantId,
                        RoleId
                    });
                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.EmployeeList = (await spcall.ReadAsync<User>()).ToList();
                    dto.CompanyList = (await spcall.ReadAsync<Company>()).ToList();
                    dto.SecurityList = (await spcall.ReadAsync<User>()).ToList();
                    if (GateId > 0)
                    {
                        dto.OnChangeCompanyList = (await spcall.ReadAsync<Plant>()).ToList();
                        dto.HdrTable = (await spcall.ReadAsync<Gate>()).SingleOrDefault();
                        dto.GateDetailList = (await spcall.ReadAsync<GateDetail>()).ToList();
                    }

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
        public async Task<object> SearchInitialize(JObject obj)
        {
            try
            {
                int GateId = obj["GateId"].ToObject<int>();
                string Type = "SearchInitialize";
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_GATE_CI", new
                    {
                        Type,
                        GateId,
                        CompanyId,
                        RoleId,
                        PlantId
                    });

                    dto.GateList = (await spcall.ReadAsync<dynamic>()).ToList();
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
        public async Task<object> Create(JObject obj)
        {
            try
            {
                Gate Gate = obj["Gate"].ToObject<Gate>();
                Gate.GateDetails = obj["GateDetail"].ToObject<List<GateDetail>>();
                string GateName = Gate.GateName;
                string GateNo = Gate.GateNo;
                //if GateName is already exists it show error
                var isExists = DbContext.Gates.Where(x => x.GateName.Equals(GateName) && x.CompanyId == Gate.CompanyId && x.PlantId == Gate.PlantId).ToList();
                var isExistsGateNo = DbContext.Gates.Where(g => g.GateNo.Equals(GateNo) && g.CompanyId == Gate.CompanyId && g.PlantId == Gate.PlantId).ToList();
                if (isExists.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "Gate name is already exists."
                    });
                    return dto;
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    //Autogenerate GateCode
                    Gate.GateCode = await GenerateUniqueCode();
                    DbContext.Gates.Add(Gate);
                    await DbContext.SaveChangesAsync();
                    dto.transtatus.result = true;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = "Created Successfully"
                       }
                   );
                }
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

                string Type = "OnChangeCompany";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_Gate_CI", new
                    {
                        Type,
                        GateId=(object)null,
                        CompanyId,
                        PlantId=(object)null,
                        RoleId=(object)null
                    });
                    dto.OnChangeCompanyList = (await spcall.ReadAsync<Plant>()).ToList();
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
        public async Task<object> Update(JObject obj)
        {
            try
            {
                Gate Gate = obj["Gate"].ToObject<Gate>();
                Gate.GateDetails = obj["GateDetail"].ToObject<List<GateDetail>>();
                string GateName = Gate.GateName;
                long GateId = Gate.GateId;
                //if GateName is already exists it show error
                var isExists = DbContext.Gates.Where(x => x.GateName.Equals(GateName) && x.GateId != GateId && x.CompanyId == Gate.CompanyId && x.PlantId == Gate.PlantId).ToList();
                if (isExists.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "Gate name is already exists."
                    });
                    return dto;
                }
                if (Gate.Status != 1)
                {
                    var isexistuser = DbContext.UserGateMaps.Where(x => x.GateId == GateId && x.CompanyId == Gate.CompanyId && x.Status == 1).ToList();
                    if (isexistuser.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            Message = "Inactive not allowed. This Gate is linked to active Users."
                        });
                        return dto;
                    }
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    var gd = DbContext.GateDetails.Where(x => x.GateId == Gate.GateId).ToList();
                    DbContext.GateDetails.RemoveRange(gd);
                    DbContext.Gates.Update(Gate);
                    await DbContext.SaveChangesAsync();
                    dto.transtatus.result = true;
                    dto.transtatus.lstErrorItem.Add(
                      new ErrorItem
                      {
                          Message = "Updated Successfully"
                      }
                  );
                }

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
                int GateId = obj["GateId"].ToObject<int>();
                Gate Gate = DbContext.Gates.Where(y => y.GateId == GateId).SingleOrDefault();
                var isexistuser = DbContext.UserGateMaps.Where(x => x.GateId == GateId && x.Status == 1).ToList();
                if (isexistuser.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        Message = "Inactive not allowed. This Gate is linked to active Users."
                    });
                    return dto;
                }
                Gate.Status = 2;
                DbContext.Gates.Update(Gate);
                await DbContext.SaveChangesAsync();
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "Status has been changed successfully"
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
        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "19";
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