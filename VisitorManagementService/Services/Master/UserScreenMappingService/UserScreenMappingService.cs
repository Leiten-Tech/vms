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

namespace VisitorManagementMySQL.Services.Master.UserScreenMappingService
{
    public class UserScreenMappingService : IUserScreenMappingService
    {
        private readonly IDapperContext dapperContext;
        private readonly UserSreenMappingDTO dto;
        private readonly DbContextHelper dbContextHelper;

        public UserScreenMappingService(IDapperContext _dapperContext, DbContextHelper _dbContextHelper)
        {
            dapperContext = _dapperContext;
            dbContextHelper = _dbContextHelper;
            dto = new UserSreenMappingDTO();
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();

        }

        public async Task<object> Create(JObject obj)
        {
            List<UserScreenMapping> UserScreenMapping = obj["UserScreenMapping"].ToObject<List<UserScreenMapping>>();
            try
            {

                var RemoveList = await dbContextHelper.UserScreenMappings.Where(y => y.UserId == UserScreenMapping[0].UserId && y.RoleId == UserScreenMapping[0].RoleId).ToListAsync();
                dbContextHelper.UserScreenMappings.RemoveRange(RemoveList);
                dbContextHelper.UserScreenMappings.AddRange(UserScreenMapping);
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
                
                dto.ModuleList = await dbContextHelper.Functions.Where(u => u.ParentId == 0 && u.Status == 1).ToListAsync();

                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "" 
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

        public async Task<object> GetModuleAndFunction(JObject obj)
        {
            int RoleId = obj["RoleId"].ToObject<int>();
            int UserId = obj["UserId"].ToObject<int>();
            List<int?> ModuleIds = obj["ModuleId"].ToObject<List<int?>>();
            string ModuleId = string.Join(",", ModuleIds);
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_GET_USER_ROLEMAPPED_FUNCTIONS", new
                    {
                        RoleId,
                        UserId,
                        ModuleId
                    });
                    dto.UserScreens = (await spcall.ReadAsync<dynamic>()).ToList();
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
        public async Task<object> GetUser(JObject obj)
        {
            int Roleid = obj["RoleId"].ToObject<int>();
            long PlantId = obj["PlantId"].ToObject<long>();
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_GET_ROLEMAPPED_USERS", new
                    {
                        Roleid,
                        PlantId
                    });
                    dto.UserList = (await spcall.ReadAsync<dynamic>()).ToList();
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
        public Task<object> SearchInitialize(JObject obj)
        {
            throw new System.NotImplementedException();
        }

        public Task<object> Update(JObject obj)
        {
            throw new System.NotImplementedException();
        }
    }
}