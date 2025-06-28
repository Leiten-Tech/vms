using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;
using Microsoft.EntityFrameworkCore;


namespace VisitorManagementMySQL.Services.Master.CatetoryCPMappingService
{
    public class CategoryCPMappingService : ICategoryCPMappingService
    {
        private readonly CategoryCPMappingDto dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;

        public CategoryCPMappingService(
            DbContextHelper _dbContextHelper,
            IDapperContext _dapperContext
        )
        {
            dto = new CategoryCPMappingDto();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.tranStatus = new ErrorContext();
            dto.tranStatus.lstErrorItem = new List<ErrorItem>();
        }

        public async Task<object> CreateInitialize(JObject obj)
        {
            try
            {
                string Type = "CreateInitialize";
                int CategoryId = obj["CategoryId"].ToObject<int>();
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_Category_CP_Map_CI",
                        new
                        {
                            Type,
                            CategoryId,
                            text = (object)null,
                        }
                    );

                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    if (CategoryId > 0)
                    {
                        dto.CategoryMapList = (await spcall.ReadAsync<dynamic>()).ToList();
                        dto.CategoryMapDetailList = (await spcall.ReadAsync<dynamic>()).ToList();
                    }
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { Message = "Something Went Wrong, Please Try Again." }
                );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }

            return dto;
        }

        public async Task<object> SearchInitialize(JObject obj)
        {
            try
            {
                int CategoryId = obj["CategoryId"].ToObject<int>();
                string Type = "SearchInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_Category_CP_Map_CI",
                        new
                        {
                            Type,
                            CategoryId,
                            text = (object)null,
                        }
                    );

                    dto.CategoryCPMapList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { Message = "Something Went Wrong, Please Try Again." }
                );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }

            return dto;
        }

        public async Task<object> Create(JObject obj)
        {
            try
            {
                CategoryCpMap categorymap = obj["CategoryMap"].ToObject<CategoryCpMap>();
                categorymap.CategoryCpMapDetails = obj["CategoryMapDetail"]
                    .ToObject<List<CategoryCpMapDetail>>();

                //already exists
                var isExists = DbContext
                    .CategoryCpMaps.Where(x => x.CategoryId == categorymap.CategoryId)
                    .ToList();
                if (isExists.Count > 0)
                {
                    dto.tranStatus.result = false;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message = "Category is already exists.",
                        }
                    );
                    return dto;
                }

                // foreach (var i in categorymap)
                // {
                //     List<CategoryCpMap> categoryMap = DbContext.CategoryCpMaps.Where(u => u.CategoryId == i.CategoryId).ToList();
                //     DbContext.CategoryCpMaps.RemoveRange(categoryMap);
                // }
                DbContext.CategoryCpMaps.Add(categorymap);
                await DbContext.SaveChangesAsync();
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { Message = "Created Successfully" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }

            return dto;
        }

        public async Task<object> Update(JObject obj)
        {
            try
            {
                CategoryCpMap categorymap = obj["CategoryMap"].ToObject<CategoryCpMap>();
                List<CategoryCpMapDetail> categoryCpMapDtls = obj["CategoryMapDetail"]
                    .ToObject<List<CategoryCpMapDetail>>();

                List<CategoryCpMapDetail> categoryMapDtl = DbContext
                    .CategoryCpMapDetails.Where(u => u.CategoryId == categorymap.CategoryId)
                    .AsNoTracking()
                    .ToList();
                if(categoryMapDtl.Count > 0)
                {
                    foreach (var i in categoryMapDtl)
                    {
                        DbContext.CategoryCpMapDetails.Remove(i);
                    }
                }

                categorymap.CategoryCpMapDetails = categoryCpMapDtls;
                DbContext.CategoryCpMaps.Update(categorymap);
                await DbContext.SaveChangesAsync();
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { Message = "Updated Successfully" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }

            return dto;
        }

        public async Task<object> ChangeStatus(JObject obj)
        {
            try
            {
                int CategoryId = obj["CategoryId"].ToObject<int>();
                CategoryCpMap category = DbContext
                    .CategoryCpMaps.Where(y => y.CategoryId == CategoryId)
                    .SingleOrDefault();
                category.Status = 2;
                DbContext.CategoryCpMaps.Update(category);
                await DbContext.SaveChangesAsync();
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { Message = "Status has been changed successfully" }
                );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<CategoryCPMappingDto> FilterCategory(JObject obj)
        {
            try
            {
                String text = obj["CategoryName"].ToObject<String>();
                string type = "FilterCategory";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_Category_CP_Map_CI",
                        new
                        {
                            text,
                            type,
                            CategoryId = (object)null,
                        }
                    );
                    dto.CategoryList = (await spcall.ReadAsync<Category>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "No Category Found." }
                );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }
    }
}
