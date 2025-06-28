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

namespace VisitorManagementMySQL.Services.Master.VehicleService
{
    public class VehicleService : IVehicleService
    {
        private readonly VehicleDto dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly FileUploadService.FileUploadService uploadService;
        public VehicleService
        (
            DbContextHelper _dbContextHelper,
            IDapperContext _dapperContext,
            FileUploadService.FileUploadService _uploadService,
            IHttpContextAccessor httpContextAccessor
        )
        {
            dto = new VehicleDto();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            uploadService = _uploadService;
            _httpContextAccessor = httpContextAccessor;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();

        }
        public async Task<object> CreateInitialize(JObject obj)
        {
            long VehicleId = obj["VehicleId"].ToObject<long>();
            long CompanyId = obj["CompanyId"].ToObject<long>();
            long RoleId = obj["RoleId"].ToObject<long>();
            long PlantId = obj["PlantId"].ToObject<long>();
            string Type = "CreateInitialize";
            string Schemevehicledetail = _httpContextAccessor.HttpContext.Request.Scheme + "://" + _httpContextAccessor.HttpContext.Request.Host.Value.ToString() + "/upload/VehicleDocumentDetail/";
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_VEHICLE_CI", new
                    {
                        Type,
                        VehicleId,
                        Schemevehicledetail,
                        CompanyId,
                        RoleId,
                        PlantId
                    });

                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.VehicleTypeList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.SupplierList = (await spcall.ReadAsync<Supplier>()).ToList();
                    dto.CompanyList = (await spcall.ReadAsync<Company>()).ToList();
                    dto.PlantList = (await spcall.ReadAsync<Plant>()).ToList();
                    dto.DriverList = (await spcall.ReadAsync<User>()).ToList();
                    if (VehicleId > 0)
                    {
                        dto.HdrTable = (await spcall.ReadAsync<Vehicle>()).SingleOrDefault();
                        dto.VehicleDocumentDetailList = (await spcall.ReadAsync<VehicleDocumentDetail>()).ToList();
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
            int VehicleId = obj["VehicleId"].ToObject<int>();
            string Type = "SearchInitialize";
            long CompanyId = obj["CompanyId"].ToObject<long>();
            long RoleId = obj["RoleId"].ToObject<long>();
            long PlantId = obj["PlantId"].ToObject<long>();
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_VEHICLE_CI", new
                    {
                        Type,
                        VehicleId,
                        Schemevehicledetail = (Object)null,
                        CompanyId,
                        RoleId,
                        PlantId
                    });

                    dto.VehicleList = (await spcall.ReadAsync<dynamic>()).ToList();
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
        public async Task<object> Create(object obj, List<IFormFile> webfiles)
        {
            try
            {
                Newtonsoft.Json.Linq.JObject _VehicleJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();
                Vehicle Vehicle = (Vehicle)serializer.Deserialize(new JTokenReader(_VehicleJSON["Vehicle"]), typeof(Vehicle));
                Vehicle.VehicleDocumentDetails = (List<VehicleDocumentDetail>)serializer.Deserialize(new JTokenReader(_VehicleJSON["VehicleDocumentDetail"]), typeof(List<VehicleDocumentDetail>));

                string VehicleName = Vehicle.VehicleName;
                string VehicleNo = Vehicle.VehicleNo;
                //if Vehicle is already exists it show error

                if (Vehicle.VehicleName != null)
                {
                    var isExists = DbContext.Vehicles.Where(x => x.VehicleName.Equals(VehicleName) && x.VehicleNo.Equals(VehicleNo) && x.CompanyId == Vehicle.CompanyId).ToList();
                    if (isExists.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message = "Vehicle is already exists."
                        });
                        return dto;
                    }
                }

                //if Vehicle No is already exists it show error
                var isNoExists = DbContext.Vehicles.Where(x => x.VehicleNo.Equals(VehicleNo) && x.CompanyId == Vehicle.CompanyId).ToList();
                if (isNoExists.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "Vehicle No is already exists."
                    });
                    return dto;
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    var resturnstrings = uploadService.UploadFiles(webfiles, "VehicleDocumentDetail");
                    // Autogenerate VehicleCode
                    Vehicle.VehicleCode = await GenerateUniqueCode();
                    // Vehicle.VehicleCode = "veh0001";
                    DbContext.Vehicles.Add(Vehicle);
                    await DbContext.SaveChangesAsync();

                    var vehicleCreated = DbContext.Vehicles.Where(x => x.VehicleCode == Vehicle.VehicleCode).SingleOrDefault();
                    dto.HdrTable = vehicleCreated;

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
        public async Task<object> Update(object obj, List<IFormFile> webfiles)
        {
            // Vehicle Vehicle = obj["Vehicle"].ToObject<Vehicle>();
            // Vehicle.VehicleDocumentDetails = obj["VehicleDocumentDetail"].ToObject<List<VehicleDocumentDetail>>();
            Newtonsoft.Json.Linq.JObject _VehicleJSON = (Newtonsoft.Json.Linq.JObject)obj;
            Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();
            Vehicle Vehicle = (Vehicle)serializer.Deserialize(new JTokenReader(_VehicleJSON["Vehicle"]), typeof(Vehicle));
            Vehicle.VehicleDocumentDetails = (List<VehicleDocumentDetail>)serializer.Deserialize(new JTokenReader(_VehicleJSON["VehicleDocumentDetail"]), typeof(List<VehicleDocumentDetail>));
            try
            {
                string VehicleName = Vehicle.VehicleName;
                string VehicleNo = Vehicle.VehicleNo;
                long VehicleId = Vehicle.VehicleId;
                //if Vehicle is already exists it show error
                
                if (Vehicle.VehicleName != null)
                {
                    var isExists = DbContext.Vehicles.Where(x => x.VehicleName.Equals(VehicleName) && x.VehicleNo.Equals(VehicleNo) && x.VehicleId != VehicleId && x.CompanyId == Vehicle.CompanyId).ToList();
                    if (isExists.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message = "Vehicle is already exists."
                        });
                        return dto;
                    }
                }
                //if Vehicle No is already exists it show error
                var isNoExists = DbContext.Vehicles.Where(x => x.VehicleNo.Equals(VehicleNo) && x.VehicleId != VehicleId && x.CompanyId == Vehicle.CompanyId).ToList();
                if (isNoExists.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "Vehicle No is already exists."
                    });
                    return dto;
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    var resturnstrings = uploadService.UploadFiles(webfiles, "VehicleDocumentDetail");
                    var vd = DbContext.VehicleDocumentDetails.Where(x => x.VehicleId == Vehicle.VehicleId).ToList();
                    DbContext.VehicleDocumentDetails.RemoveRange(vd);
                    DbContext.Vehicles.Update(Vehicle);
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
            int VehicleId = obj["VehicleId"].ToObject<int>();
            try
            {
                Vehicle Vehicle = DbContext.Vehicles.Where(y => y.VehicleId == VehicleId).SingleOrDefault();
                Vehicle.Status = 2;
                DbContext.Vehicles.Update(Vehicle);
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
            string documentid = "7";
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