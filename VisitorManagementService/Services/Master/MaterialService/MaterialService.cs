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
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;


namespace VisitorManagementMySQL.Services.Master.MaterialService
{
    public class MaterialService : IMaterialService
    {
        private readonly MaterialDto dto;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        private readonly FileUploadService.FileUploadService uploadService;
        public MaterialService(DbContextHelper _dbContextHelper,
         IDapperContext _dapperContext,
         IHttpContextAccessor _httpContextAccessor,
         FileUploadService.FileUploadService _uploadService)
        {
            dto = new MaterialDto();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            uploadService = _uploadService;
            httpContextAccessor = _httpContextAccessor;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }
        public async Task<object> CreateInitialize(JObject obj)
        {
            try
            {
                int MaterialId = obj["MaterialId"].ToObject<int>();
                string Type = "CreateInitialize";
                string Scheme = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host.Value.ToString()}/upload/Material/";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_MATERIAL_CI", new
                    {
                        Type,
                        MaterialId,
                        Scheme
                    });
                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.UomList = (await spcall.ReadAsync<dynamic>()).ToList();

                    if (MaterialId > 0)
                    {
                        dto.HdrTable = (await spcall.ReadAsync<Material>()).SingleOrDefault();
                        dto.MaterialTypeList = (await spcall.ReadAsync<MaterialType>()).ToList();
                        dto.MaterialCategoryList = (await spcall.ReadAsync<MaterialCategory>()).ToList();
                        dto.MaterialSubCategoryList = (await spcall.ReadAsync<MaterialSubCategory>()).ToList();

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

        public async Task<Object> OnChangeMaterialType(JObject obj)
        {
            try
            {
                string MaterialTypeName = obj["MaterialTypeName"].ToObject<string>();
                string Type = "OnChangeMaterialType";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_MATERIAL_CI", new
                    {
                        Type,
                        MaterialTypeName

                    });
                    dto.MaterialTypeOnChange = (await spcall.ReadAsync<MaterialType>()).ToList();
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
        public async Task<Object> OnChangeMaterialCatagory(JObject obj)
        {
            try
            {
                string MaterialCategoryName = obj["MaterialCategoryName"].ToObject<string>();
                string Type = "OnChangeMaterialCatagory";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_MATERIAL_CI", new
                    {
                        Type,
                        MaterialCategoryName
                    });
                    dto.MaterialCategoryOnChange = (await spcall.ReadAsync<MaterialCategory>()).ToList();
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
        public async Task<Object> OnChangeMaterialSubCatagory(JObject obj)
        {
            try
            {
                string MaterialSubCategoryName = obj["MaterialSubCategoryName"].ToObject<string>();
                string Type = "OnChangeMaterialSubCatagory";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_MATERIAL_CI", new
                    {
                        Type,
                        MaterialSubCategoryName
                    });
                    dto.MaterialSubCategoryOnChange = (await spcall.ReadAsync<MaterialSubCategory>()).ToList();
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
                int MaterialId = obj["MaterialId"].ToObject<int>();
                string Type = "SearchInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_MATERIAL_CI", new
                    {
                        Type,
                        MaterialId
                    });

                    dto.MaterialList = (await spcall.ReadAsync<dynamic>()).ToList();
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

        public async Task<object> Create(JObject obj, IFormFile webfile)
        {
            try
            {
                Material Material = obj["Material"].ToObject<Material>();
                string MaterialTypeName = obj["MaterialTypeName"].ToObject<string>();
                string MaterialCategoryName = obj["MaterialCategoryName"].ToObject<string>();
                string MaterialSubCategoryName = obj["MaterialSubCategoryName"].ToObject<string>();
                string MaterialName = Material.MaterialName;

                //if materialName is already exists it show error
                var isExists = DbContext.Materials.Where(x => x.MaterialName.Equals(MaterialName)).ToList();
                if (isExists.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "Material name already exists."
                    });
                    return dto;
                }

                using (var transaction = DbContext.Database.BeginTransaction())
                {

                    if (dto.transtatus.lstErrorItem.Count == 0)
                    {
                        //Autogenerate Materialcode
                        Material.MaterialCode = await GenerateUniqueCode("6");
                        var returnedimage = uploadService.UploadFile(webfile, "Material");
                        var mty = DbContext.MaterialTypes.Where(x => x.MaterialTypeName.Equals(MaterialTypeName)).SingleOrDefault();
                        var mtc = DbContext.MaterialCategories.Where(x => x.MaterialCategoryName.Equals(MaterialCategoryName)).SingleOrDefault();
                        var mtsc = DbContext.MaterialSubCategories.Where(x => x.MaterialSubCategoryName.Equals(MaterialSubCategoryName)).SingleOrDefault();
                        if (mty == null)
                        {
                            MaterialType mt = new MaterialType();
                            mt.MaterialTypeId = 0;
                            mt.MaterialTypeName = MaterialTypeName;
                            mt.Status = 1;
                            mt.CreatedBy = Material.CreatedBy;
                            mt.CreatedOn = Material.CreatedOn;
                            mt.ModifiedBy = Material.ModifiedBy;
                            mt.ModifiedOn = Material.ModifiedOn;
                            DbContext.MaterialTypes.Add(mt);
                            DbContext.SaveChanges();
                            long mtId = DbContext.MaterialTypes.Where(x => x.MaterialTypeName.Equals(MaterialTypeName)).SingleOrDefault().MaterialTypeId;
                            Material.MaterialType = mtId;
                        }
                        else
                        {
                            Material.MaterialType = mty.MaterialTypeId;
                        }

                        if (mtc == null)
                        {
                            MaterialCategory mc = new MaterialCategory();
                            mc.MaterialCategoryId = 0;
                            mc.MaterialCategoryName = MaterialCategoryName;
                            mc.Status = 1;
                            mc.CreatedBy = Material.CreatedBy;
                            mc.CreatedOn = Material.CreatedOn;
                            mc.ModifiedBy = Material.ModifiedBy;
                            mc.ModifiedOn = Material.ModifiedOn;
                            DbContext.MaterialCategories.Add(mc);
                            DbContext.SaveChanges();
                            long mcId = DbContext.MaterialCategories.Where(x => x.MaterialCategoryName.Equals(MaterialCategoryName)).SingleOrDefault().MaterialCategoryId;
                            Material.MaterialCategoryId = mcId;
                        }
                        else
                        {
                            Material.MaterialCategoryId = mtc.MaterialCategoryId;
                        }
                        if (mtsc == null)
                        {
                            MaterialSubCategory msc = new MaterialSubCategory();
                            msc.MaterialSubCategoryId = 0;
                            msc.MaterialCategoryId = Material.MaterialCategoryId;
                            msc.MaterialSubCategoryName = MaterialSubCategoryName;
                            msc.MaterialSubCategoryCode = await GenerateUniqueCode("13");
                            msc.Status = 1;
                            msc.CreatedBy = Material.CreatedBy;
                            msc.CreatedOn = Material.CreatedOn;
                            msc.ModifiedBy = Material.ModifiedBy;
                            msc.ModifiedOn = Material.ModifiedOn;
                            DbContext.MaterialSubCategories.Add(msc);
                            DbContext.SaveChanges();
                            long mscId = DbContext.MaterialSubCategories.Where(x => x.MaterialSubCategoryName.Equals(MaterialSubCategoryName)).SingleOrDefault().MaterialSubCategoryId;
                            Material.MaterialSubCategoryId = mscId;
                        }
                        else
                        {
                            Material.MaterialSubCategoryId = mtsc.MaterialSubCategoryId;
                        }

                        DbContext.Materials.Add(Material);
                        await DbContext.SaveChangesAsync();

                        dto.transtatus.result = true;
                        dto.transtatus.lstErrorItem.Add(
                           new ErrorItem
                           {
                               Message = "Created successfully"
                           }
                        );
                    }
                    transaction.Commit();
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

        public async Task<object> Update(JObject obj, IFormFile webfile)
        {
            try
            {
                Material Material = obj["Material"].ToObject<Material>();
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    string MaterialName = Material.MaterialName;
                    var isExists = DbContext.Materials.Where(x => x.MaterialName.Equals(MaterialName) & x.MaterialId != Material.MaterialId).ToList();
                    if (isExists.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message = "Material name already exists."
                        });
                        return dto;
                    }

                    var returnedimage = uploadService.UploadFile(webfile, "User");
                    DbContext.Materials.Update(Material);
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
                int MaterialId = obj["MaterialId"].ToObject<int>();
                Material Material = DbContext.Materials.Where(y => y.MaterialId == MaterialId).SingleOrDefault();
                Material.Status = 2;
                DbContext.Materials.Update(Material);
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

        public async Task<string> GenerateUniqueCode(string docid)
        {
            string documentno = "";
            string documentid = docid;
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