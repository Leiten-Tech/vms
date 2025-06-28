using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;

namespace VisitorManagementMySQL.Services.Master.DriverService
{
    public class DriverService : IDriverService
    {
        private readonly DriverDto dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        public DriverService(DbContextHelper _dbContextHelper, IDapperContext _dapperContext)
        {
            dto = new DriverDto();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();

        }
        public async Task<object> CreateInitialize(JObject obj)
        {
            int DriverId = obj["DriverId"].ToObject<int>();
            string Type = "CreateInitialize";
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_DRIVER_CI", new
                    {
                        Type,
                        DriverId
                    });

                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.EmployeeList = (await spcall.ReadAsync<Employee>()).ToList();
                    dto.SupplierList = (await spcall.ReadAsync<Supplier>()).ToList();
                    if (DriverId > 0)
                    {
                        dto.HdrTable = (await spcall.ReadAsync<Driver>()).SingleOrDefault();
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
            int DriverId = obj["DriverId"].ToObject<int>();
            string Type = "SearchInitialize";
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_DRIVER_CI", new
                    {
                        Type,
                        DriverId
                    });
                    dto.DriverList = (await spcall.ReadAsync<dynamic>()).ToList();
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
                Driver Driver = obj["Driver"].ToObject<Driver>();
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    //Autogenerate DriverCode
                    Driver.DriverCode = await GenerateUniqueCode();
                    DbContext.Drivers.Add(Driver);
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
        public async Task<object> Update(JObject obj)
        {
            try
            {
                Driver Driver = obj["Driver"].ToObject<Driver>();
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    DbContext.Drivers.Update(Driver);
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
            int DriverId = obj["DriverId"].ToObject<int>();
            try
            {
                Driver Driver = DbContext.Drivers.Where(y => y.DriverId == DriverId).SingleOrDefault();
                Driver.Status = 2;
                DbContext.Drivers.Update(Driver);
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
            string documentid = "25";
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