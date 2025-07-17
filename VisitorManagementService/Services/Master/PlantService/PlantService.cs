using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Services.Master.PlantService
{
    public class PlantService : IPlantService
    {
        private readonly PlantDto dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;

        public PlantService(DbContextHelper _dbContext, IDapperContext _dapperContext)
        {
            dto = new PlantDto();
            DbContext = _dbContext;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }

        public async Task<object> CreateInitialize(JObject obj)
        {
            long PlantId = obj["PlantId"].ToObject<long>();
            long CompanyId = obj["CompanyId"].ToObject<long>();
            long RoleId = obj["RoleId"].ToObject<long>();
            string Type = "CreateInitialize";
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_PLANT_CI",
                        new
                        {
                            Type,
                            PlantId,
                            RoleId,
                            CountryId = (object)null,
                            StateId = (object)null,
                            CompanyId,
                            DepartmentId = (object)null,
                        }
                    );

                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.PlantTypeList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.CompanyList = (await spcall.ReadAsync<Company>()).ToList();
                    dto.CountryList = (await spcall.ReadAsync<Country>()).ToList();
                    dto.LevelList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.DepartmentList = (await spcall.ReadAsync<Department>()).ToList();

                    if (PlantId > 0)
                    {
                        dto.StateList = (await spcall.ReadAsync<State>()).ToList();
                        dto.CityList = (await spcall.ReadAsync<City>()).ToList();
                        dto.HdrTable = (await spcall.ReadAsync<Plant>()).SingleOrDefault();
                        dto.DetailList = (await spcall.ReadAsync<PlantNotificationDetail>()).ToList();
                        dto.PrimaryUserList = (await spcall.ReadAsync<User>()).ToList();
                    }
                }
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { Message = "Something Went Wrong, Please Try Again." }
                );
            }
            catch (Exception ex)
            {
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }

            return dto;
        }

        public async Task<Object> OnChangeCountry(JObject obj)
        {
            try
            {
                string CountryId = obj["CountryId"].ToObject<string>();
                string Type = "OnChangeCountry";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_PLANT_CI",
                        new
                        {
                            Type,
                            PlantId = (object)null,
                            CountryId,
                            StateId = (object)null,
                            RoleId = (object)null,
                            CompanyId = (object)null,
                            DepartmentId = (object)null,
                        }
                    );
                    dto.StateList = (await spcall.ReadAsync<State>()).ToList();
                }
                dto.transtatus.result = true;
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<Object> OnChangeState(JObject obj)
        {
            try
            {
                string StateId = obj["StateId"].ToObject<string>();
                string Type = "OnChangeState";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_PLANT_CI",
                        new
                        {
                            Type,
                            PlantId = (object)null,
                            CountryId = (object)null,
                            RoleId = (object)null,
                            StateId,
                            CompanyId = (object)null,
                            DepartmentId = (object)null,

                        }
                    );
                    dto.CityList = (await spcall.ReadAsync<City>()).ToList();
                }
                dto.transtatus.result = true;
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<Object> OnChangeDepartment(JObject obj)
        {
            try
            {
                long DepartmentId = obj["DepartmentId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                string Type = "OnChangeDepartment";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_PLANT_CI", new
                    {
                            Type,
                            PlantId = (object)null,
                            CountryId = (object)null,
                            RoleId = (object)null,
                            StateId = (object)null,
                            CompanyId ,
                            DepartmentId,

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
            string Type = "SearchInitialize";
            long PlantId = obj["PlantId"].ToObject<long>();
            long CompanyId = obj["CompanyId"].ToObject<long>();
            int RoleId = obj["RoleId"].ToObject<int>();

            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_PLANT_CI",
                        new
                        {
                            Type,
                            PlantId,
                            CompanyId,
                            RoleId,
                            CountryId = (object)null,
                            StateId = (object)null,
                            DepartmentId = (object)null,
                        }
                    );

                    dto.PlantList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { Message = "Something Went Wrong, Please Try Again." }
                );
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }

            return dto;
        }

        public async Task<object> Create(JObject obj)
        {
            try
            {

                Newtonsoft.Json.Linq.JObject _PlantJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();

                Plant Plant = obj["Plant"].ToObject<Plant>();
                Plant.PlantNotificationDetails = (List<PlantNotificationDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_PlantJSON["PlantNotificationDetails"]),
                            typeof(List<PlantNotificationDetail>)
                        );
                string PlantName = Plant.PlantName;
                long CompanyId = Plant.CompanyId;
                //if PlantName is already exists it show error
                var isExists = DbContext
                    .Plants.Where(x =>
                        x.PlantName.Equals(PlantName) && x.CompanyId.Equals(CompanyId)
                    )
                    .ToList();
                if (isExists.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message = $"Plant Name :{Plant.PlantName} already exists. ",
                        }
                    );
                    return dto;
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    //Autogenerate PlantCode
                    Plant.PlantCode = await GenerateUniqueCode();
                    // Plant.PlantCode = "PLT003";
                    DbContext.Plants.Add(Plant);
                    await DbContext.SaveChangesAsync();
                    var plantCreated = DbContext
                        .Plants.Where(x => x.PlantCode == Plant.PlantCode)
                        .SingleOrDefault();
                    dto.HdrTable = plantCreated;

                    dto.transtatus.result = true;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem { Message = "Created Successfully" }
                    );
                }
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }

            return dto;
        }

        public async Task<object> Update(JObject obj)
        {
            try
            {
                Newtonsoft.Json.Linq.JObject _PlantJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();

                Plant Plant = obj["Plant"].ToObject<Plant>();
                // Plant.PlantNotificationDetails = (List<PlantNotificationDetail>)
                //         serializer.Deserialize(
                //             new JTokenReader(_PlantJSON["PlantNotificationDetails"]),
                //             typeof(List<PlantNotificationDetail>)
                //         );

                var detailsToken = _PlantJSON["PlantNotificationDetails"];

                if (detailsToken != null && detailsToken.Type != JTokenType.Null)
                {
                    Plant.PlantNotificationDetails = (List<PlantNotificationDetail>)
                        serializer.Deserialize(
                            new JTokenReader(detailsToken),
                            typeof(List<PlantNotificationDetail>)
                        );
                }
                else
                {
                    Plant.PlantNotificationDetails = new List<PlantNotificationDetail>(); // or set to null if needed
                }

                long PlantId = Plant.PlantId;
                long CompanyId = Plant.CompanyId;
                string PlantName = Plant.PlantName;
                var isexistUser = DbContext.UserPlantMaps.Where(x => x.PlantId == PlantId).ToList();
                var isexistEmp = DbContext.Employees.Where(x => x.PlantId == PlantId).ToList();
                var isexistGates = DbContext.Gates.Where(x => x.PlantId == PlantId).ToList();
                var isExistsName = DbContext
                    .Plants.Where(x =>
                        x.PlantName.Equals(PlantName) & x.PlantId != Plant.PlantId
                        && x.CompanyId.Equals(CompanyId)
                    )
                    .ToList();
                if (isExistsName.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message = $"Plant Name :{Plant.PlantName} already exists. ",
                        }
                    );
                    return dto;
                }
                if (Plant.Status != 1)
                {
                    if (isexistUser.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                Message =
                                    "Inactive not allowed. This Plant is linked to active User.",
                            }
                        );
                        return dto;
                    }
                    if (isexistEmp.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                Message =
                                    "Inactive not allowed. This Plant is linked to active Employee.",
                            }
                        );
                        return dto;
                    }
                    if (isexistGates.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                Message =
                                    "Inactive not allowed. This Plant is linked to active Gate.",
                            }
                        );
                        return dto;
                    }
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    DbContext.Plants.Update(Plant);
                    await DbContext.SaveChangesAsync();
                    var plantUpdate = DbContext
                        .Plants.Where(x => x.PlantCode == Plant.PlantCode)
                        .SingleOrDefault();
                    dto.HdrTable = plantUpdate;
                    dto.transtatus.result = true;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem { Message = "Updated Successfully" }
                    );
                }
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<object> ChangeStatus(JObject obj)
        {
            long PlantId = obj["PlantId"].ToObject<long>();
            try
            {
                var isexistUser = DbContext.UserPlantMaps.Where(x => x.PlantId == PlantId).ToList();
                if (isexistUser.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            Message = "Inactive not allowed. This Plant is linked to active User.",
                        }
                    );
                    return dto;
                }

                var isexistEmp = DbContext.Employees.Where(x => x.PlantId == PlantId).ToList();
                if (isexistEmp.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            Message =
                                "Inactive not allowed. This Plant is linked to active Employee.",
                        }
                    );
                    return dto;
                }
                var isexistGates = DbContext.Gates.Where(x => x.PlantId == PlantId).ToList();
                if (isexistGates.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            Message = "Inactive not allowed. This Plant is linked to active Gate.",
                        }
                    );
                    return dto;
                }
                var isexistAreas = DbContext.Areas.Where(x => x.PlantId == PlantId).ToList();
                if (isexistAreas.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            Message = "Inactive not allowed. This Plant is linked to active Area.",
                        }
                    );
                    return dto;
                }
                Plant Plant = DbContext.Plants.Where(y => y.PlantId == PlantId).SingleOrDefault();
                Plant.Status = 2;
                DbContext.Plants.Update(Plant);
                await DbContext.SaveChangesAsync();
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { Message = "Status Changed Successfully" }
                );
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        // public async Task<object> ChangeApproveStatus(JObject obj)
        // {
        //     long PlantId = obj["PlantId"].ToObject<long>();
        //     try
        //     {

        //         Plant Plant = DbContext.Plants.Where(y => y.PlantId == PlantId).SingleOrDefault();
        //         Plant.Status = 2;
        //         DbContext.Plants.Update(Plant);
        //         await DbContext.SaveChangesAsync();
        //         dto.transtatus.result = true;
        //         dto.transtatus.lstErrorItem.Add(
        //            new ErrorItem
        //            {
        //                Message = "Status Changed Successfully"
        //            }
        //        );

        //     }
        //     catch (Exception ex)
        //     {
        //         dto.transtatus.result = false;
        //         dto.transtatus.lstErrorItem.Add(
        //             new ErrorItem
        //             {
        //                 ErrorNo = "VM0000",
        //                 Message = ex.Message
        //             }
        //         );
        //     }
        //     return dto;
        // }

        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "24";
            string series = "45";
            using (dapperContext)
            {
                var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                    spName: "GetPrimaryKey",
                    new { documentid, series }
                );
                documentno = (await spcall.ReadAsync<string>()).SingleOrDefault();
            }
            return documentno;
        }
    }
}
	