using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;

namespace VisitorManagementMySQL.Services.Master.ApprovalService
{
    public class ApprovalService : IApprovalService
    {
        private readonly ApprovalDTO dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        public ApprovalService(DbContextHelper _dbContextHelper, IDapperContext _dapperContext)
        {
            dto = new ApprovalDTO();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();

        }
        public async Task<object> CreateInitialize(JObject obj)
        {
            try
            {
                long ApprovalConfigurationId = obj["ApprovalConfigurationId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long DeptId = obj["DepartmentId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "CreateInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_APPROVALCONFIGURATION_CI", new
                    {
                        Type,
                        ApprovalConfigurationId,
                        RoleId,
                        DeptId,
                        PrimaryUserId = (object)null,
                        CompanyId,
                        PlantId,
                    });
                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.PlantList = (await spcall.ReadAsync<Plant>()).ToList();
                    dto.DocumentList = (await spcall.ReadAsync<Function>()).ToList();
                    dto.ActivityList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.LevelList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.RoleList = (await spcall.ReadAsync<Role>()).ToList();
                    dto.DepartmentList = (await spcall.ReadAsync<Department>()).ToList();
                    if (ApprovalConfigurationId > 0)
                    {
                        dto.PrimaryUserList = (await spcall.ReadAsync<User>()).ToList();
                        dto.HdrTable = (await spcall.ReadAsync<ApprovalConfiguration>()).SingleOrDefault();
                        dto.DetailList = (await spcall.ReadAsync<ApprovalConfigurationDetail>()).ToList();
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
        public async Task<Object> OnChangeRole(JObject obj)
        {
            try
            {
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "OnChangeRole";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_APPROVALCONFIGURATION_CI", new
                    {
                        Type,
                        ApprovalConfigurationId = (object)null,
                        RoleId,
                        PrimaryUserId = (object)null,
                        CompanyId = (object)null,
                        PlantId,
                    });
                    dto.PrimaryUserList = (await spcall.ReadAsync<User>()).ToList();
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

        public async Task<Object> OnChangeDepartment(JObject obj)
        {
            try
            {
                long DeptId = obj["DepartmentId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "OnChangeDepartment";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_APPROVALCONFIGURATION_CI", new
                    {
                        Type,
                        ApprovalConfigurationId = (object)null,
                        RoleId = (object)null,
                        DeptId,
                        PrimaryUserId = (object)null,
                        CompanyId = (object)null,
                        PlantId,
                    });
                    dto.PrimaryUserList = (await spcall.ReadAsync<User>()).ToList();
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
        public async Task<object> SearchInitialize(JObject obj)
        {
            try
            {
                long ApprovalConfigurationId = obj["ApprovalConfigurationId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long DeptId = obj["DepartmentId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "SearchInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_APPROVALCONFIGURATION_CI", new
                    {
                        Type,
                        ApprovalConfigurationId,
                        RoleId,
                        DeptId,
                        PrimaryUserId = (object)null,
                        CompanyId,
                        PlantId,
                    });
                    dto.ApprovalList = (await spcall.ReadAsync<dynamic>()).ToList();

                    dto.transtatus.result = true;
                    dto.transtatus.lstErrorItem.Add(
                      new ErrorItem
                      {
                          Message = "Something Went Wrong, Please Try Again."
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
        public async Task<object> Create(JObject obj)
        {
            try
            {
                ApprovalConfiguration Approval = obj["ApprovalConfiguration"].ToObject<ApprovalConfiguration>();
                Approval.ApprovalConfigurationDetails = obj["ApprovalConfigurationDetail"].ToObject<List<ApprovalConfigurationDetail>>();
                var isExists = DbContext.ApprovalConfigurations.Where(x => x.DocumentId == Approval.DocumentId && x.PlantId == Approval.PlantId && x.ApprovalActivityId == Approval.ApprovalActivityId).ToList();
                if (isExists.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "The Selected Activity For this Document And Plant Is Already Exists."
                    });
                    return dto;
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    DbContext.ApprovalConfigurations.Add(Approval);
                    await DbContext.SaveChangesAsync();
                    dto.transtatus.result = true;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = "Created successfully"
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
        public async Task<object> Update(JObject obj)
        {
            try
            {
                ApprovalConfiguration Approval = obj["ApprovalConfiguration"].ToObject<ApprovalConfiguration>();
                Approval.ApprovalConfigurationDetails = obj["ApprovalConfigurationDetail"].ToObject<List<ApprovalConfigurationDetail>>();
                var isExists = DbContext.ApprovalConfigurations.Where(x => x.DocumentId == Approval.DocumentId & x.ApprovalConfigurationId != Approval.ApprovalConfigurationId && x.PlantId == Approval.PlantId && x.ApprovalActivityId == Approval.ApprovalActivityId).ToList();
                if (isExists.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "The Selected Activity For this Document And Plant Is Already Exists."
                    });
                    return dto;
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    var gd = DbContext.ApprovalConfigurationDetails.Where(x => x.ApprovalConfigurationId == Approval.ApprovalConfigurationId).ToList();
                    DbContext.ApprovalConfigurationDetails.RemoveRange(gd);
                    DbContext.ApprovalConfigurations.Update(Approval);
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
            long ApprovalConfigurationId = obj["ApprovalConfigurationId"].ToObject<long>();
            try
            {
                ApprovalConfiguration Approval = DbContext.ApprovalConfigurations.Where(y => y.ApprovalConfigurationId == ApprovalConfigurationId).SingleOrDefault();
                Approval.Status = 2;
                DbContext.ApprovalConfigurations.Update(Approval);
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
    }
}



