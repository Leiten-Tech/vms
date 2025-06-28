using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Entities;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;
using System;
using Microsoft.EntityFrameworkCore;

namespace VisitorManagementMySQL.Services.Master.RoleService
{
    public class RoleService : IRoleService
    {

        private readonly RoleDTO dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        public RoleService(DbContextHelper _dbContextHelper,
        IDapperContext _dapperContext
        )
        {
            dto = new RoleDTO();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }

        public async Task<object> ChangeStatus(JObject obj)
        {

            try
            {
                long RoleId = obj["RoleId"].ToObject<long>();
                Role Role = DbContext.Roles.Where(y => y.RoleId == RoleId).SingleOrDefault();
                var isexistUser = DbContext.UserRoleMaps.Where(x => x.RoleId == RoleId && x.Status == 1).ToList();
                var isexistEmp = DbContext.Employees.Where(x => x.DesignationId == RoleId && x.Status == 1).ToList();
                if (Role.Status == 2)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VM0000",
                            Message = "Record Already Inactivated."
                        }
                    );
                }
                if (isexistUser.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        Message = "Inactive not allowed. This Role has active Users."
                    });
                    return dto;
                }
                if (isexistEmp.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        Message = "Inactive not allowed. This Role has active Employees."
                    });
                    return dto;
                }
                Role.Status = 2;
                DbContext.Roles.Update(Role);
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

        public async Task<object> Create(JObject obj)
        {
            try
            {
                Role Role = obj["Role"].ToObject<Role>();
                Role.RoleCode = await GenerateUniqueCode();
                var rolename = DbContext.Roles.Where(y => y.RoleName == Role.RoleName && y.IsSystemGenerated == true && y.CompanyId == Role.CompanyId).SingleOrDefault();
                if (rolename != null)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"Role Name :{rolename.RoleName}  already exists. "
                       }
                   );
                    return dto;
                }
                DbContext.Roles.Add(Role);
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

        public async Task<object> CreateInitialize(JObject obj)
        {

            try
            {
                long RoleId = obj["RoleId"].ToObject<long>();
                int CompanyId = obj["CompanyId"].ToObject<int>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "CreateInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_ROLE_CI", new
                    {
                        Type,
                        RoleId,
                        CompanyId,
                        PlantId
                    });

                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();

                    if (RoleId > 0)
                    {
                        dto.HdrTable = (await spcall.ReadAsync<Role>()).SingleOrDefault();
                    }

                }
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(new ErrorItem
                {
                    Message = ""
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
        public async Task<object> SearchInitialize(JObject obj)
        {

            try
            {
                long RoleId = obj["RoleId"].ToObject<long>();
                int CompanyId = obj["CompanyId"].ToObject<int>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "SearchInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_ROLE_CI", new
                    {
                        Type,
                        RoleId,
                        CompanyId,
                        PlantId
                    });

                    dto.RoleList = (await spcall.ReadAsync<dynamic>()).ToList();
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
                Role Role = obj["Role"].ToObject<Role>();
                long RoleId = Role.RoleId;
                var isexistUser = DbContext.UserRoleMaps.Where(x => x.RoleId == RoleId && x.Status == 1 && x.CompanyId == Role.CompanyId).ToList();
                var isexistEmp = DbContext.Employees.Where(x => x.DesignationId == RoleId && x.Status == 1 && x.CompanyId == Role.CompanyId).ToList();
                var rolename = DbContext.Roles.Where(y => y.RoleName == Role.RoleName & y.RoleId != Role.RoleId && y.IsSystemGenerated == false && y.CompanyId == Role.CompanyId).SingleOrDefault();
                if (rolename != null)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"Role Name :{rolename.RoleName}  already exists. "
                       }
                   );
                    return dto;
                }
                 if(Role.Status != 1)
                {
                 //var isexistUser = DbContext.UserRoleMap.Where(x => x.RoleId == RoleId).ToList();
                if (isexistUser.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        Message = "Inactive not allowed. This Role has  active Users."
                    });
                    return dto;
                }
                if (isexistEmp.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        Message = "Inactive not allowed. This Role has active Employees."
                    });
                    return dto;
                }
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
               

                    DbContext.Roles.Update(Role);
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

        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "22";
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