using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;
namespace VisitorManagementMySQL.Services.Master.RoleScreenMappingService
{
    public class RoleScreenMappingService : IRoleScreenMappingService
    {
        private readonly IDapperContext dapperContext;
        private readonly DbContextHelper dbContextHelper;
        private readonly RoleScreenMappingDTO dto;

        public RoleScreenMappingService(IDapperContext _dapperContext, DbContextHelper _dbContextHelper)
        {
            dapperContext = _dapperContext;
            dbContextHelper = _dbContextHelper;
            dto = new RoleScreenMappingDTO();
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }

        public async Task<object> Create(JObject obj)
        {
            List<FunctionRoleMap> FunctionRoleMapList = obj["FunctionRoleMap"].ToObject<List<FunctionRoleMap>>();
            try
            {
                var RemoveList = await dbContextHelper.FunctionRoleMaps.Where(y => y.RoleId == FunctionRoleMapList[0].RoleId).ToListAsync();
                dbContextHelper.FunctionRoleMaps.RemoveRange(RemoveList);
                dbContextHelper.FunctionRoleMaps.AddRange(FunctionRoleMapList);
                await dbContextHelper.SaveChangesAsync();
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
            int RoleId = obj["RoleId"].ToObject<int>();
            int CompanyId = obj["CompanyId"].ToObject<int>();
            try
            {
                if (RoleId == 1)
                {
                    dto.RoleMasterList = await dbContextHelper.Roles.Where(y => y.Status == 1).ToListAsync();
                }
                else
                {
                    dto.RoleMasterList = await dbContextHelper.Roles.Where(y => y.Status == 1 && y.CompanyId == CompanyId).ToListAsync();
                }
                dto.ModuleList = await dbContextHelper.Functions.Where(u => u.Status == 1 && u.MenuIcon != null && u.RelLink != null).ToListAsync();
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "CreateInitialize Successfully"
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

        public async Task<object> GetDefaultModules(JObject obj)
        {
            int RoleId = obj["RoleId"].ToObject<int>();
            int CompanyId = obj["CompanyId"].ToObject<int>();

            try
            {
                if (RoleId == 1)
                {
                    dto.AllScreens = await dbContextHelper.RoleWiseScreenMappingViews.Where(r => r.RoleId == 0).ToListAsync();
                    dto.RolewiseScreenMappingViewList = await dbContextHelper.RoleWiseScreenMappingViews.Where(y => y.RoleId == RoleId).ToListAsync();
                }
                else
                {
                    dto.AllScreens = await dbContextHelper.RoleWiseScreenMappingViews.Where(r => r.RoleId == 0 && r.ScreenId != 14).ToListAsync();
                    dto.RolewiseScreenMappingViewList = await dbContextHelper.RoleWiseScreenMappingViews.Where(y => y.RoleId == RoleId && y.ScreenId != 14).ToListAsync();
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

        public async Task<object> GetFunctions(JObject obj)
        {
            int RoleId = obj["RoleId"].ToObject<int>();
            List<int?> ModuleId = obj["ModuleId"].ToObject<List<int?>>();
            try
            {
                dto.AllScreens = await dbContextHelper.RoleWiseScreenMappingViews.Where(y => ModuleId.Contains(y.ModuleId) && y.RoleId == 0).ToListAsync();
                dto.RolewiseScreenMappingViewList = await dbContextHelper.RoleWiseScreenMappingViews.Where(y => ModuleId.Contains(y.ModuleId) && y.RoleId == RoleId).ToListAsync();
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

        public Task<object> Update(JObject obj)
        {
            throw new System.NotImplementedException();
        }
    }
}