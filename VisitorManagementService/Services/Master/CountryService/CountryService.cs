using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;
using Microsoft.EntityFrameworkCore;

namespace VisitorManagementMySQL.Services.Master.CountryService
{
    public class CountryService : ICountryService
    {
        private readonly CountryDTO dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        public CountryService(DbContextHelper _dbContextHelper,
        IDapperContext _dapperContext
        )
        {
            dto = new CountryDTO();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }
        public async Task<object> ChangeStatus(JObject obj)
        {
            int Countryid = obj["Countryid"].ToObject<int>();
            var state = DbContext.States.Where(e => e.CountryId == Countryid && e.Status == 1).ToList();
            if (state.Count > 0)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(new ErrorItem
                {
                    ErrorNo = "VMS000",
                    Message = "Inactive not allowed. This Country is linked to active state."
                });
                return dto;
            }
            var isExistsVis = DbContext.Visitors.Where(v => v.CountryId == Countryid && v.Status == 1).ToList();
            if (isExistsVis.Count > 0)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(new ErrorItem
                {
                    ErrorNo = "VMS000",
                    Message = "Inactive not allowed. This Country is linked to active Visitor."
                });
                return dto;
            }

            try
            {
                VisitorManagementMySQL.Models.Country CountryMaster = DbContext.Countries.Where(y => y.CountryId == Countryid).SingleOrDefault();
                CountryMaster.Status = 2;
                DbContext.Countries.Update(CountryMaster);
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
        public async Task<object> Create(JObject obj)
        {
            VisitorManagementMySQL.Models.Country CountryMaster = obj["CountryMaster"].ToObject<VisitorManagementMySQL.Models.Country>();
            try
            {
                dto.Country = CountryMaster;
                ValidateCountryForCreate(dto);

                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    CountryMaster.CountryCode = await GenerateUniqueCode();
                    DbContext.Countries.Add(CountryMaster);
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
        public async Task<object> CreateInitialize(JObject obj)
        {
            try
            {
                long Countryid = obj["Countryid"].ToObject<long>();
                string Taskname = obj["Taskname"].ToObject<string>();
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_GET_COUNTRY", new
                    {
                        Countryid,
                        Taskname
                    });
                    if (Taskname == "CREATEINITIALIZE")
                    {
                        dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                        if (Countryid > 0)
                        {
                            dto.Country = (await spcall.ReadAsync<Country>()).SingleOrDefault();
                        }
                    }
                    else if (Taskname == "SEARCHINITIALIZE")
                    {
                        dto.CountryList = (await spcall.ReadAsync<dynamic>()).ToList();
                    }
                }
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
        public async Task<object> SearchInitialize(JObject input)
        {
            try
            {
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
            Country CountryMaster = obj["CountryMaster"].ToObject<Country>();
            dto.Country = CountryMaster;
            ValidateCountryForUpdate(dto);
            var state = DbContext.States.Where(s => s.CountryId == CountryMaster.CountryId && s.Status == 1).ToList();
            if (CountryMaster.Status == 2)
            {
                if (state.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "Inactive not allowed. This Country is linked to active state."
                    });
                    return dto;
                }
            }
            if (CountryMaster.Status == 2)
            {
                var isExistsVis = DbContext.Visitors.Where(v => v.CountryId == CountryMaster.CountryId && v.Status == 1).ToList();
                if (isExistsVis.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "Inactive not allowed. This Country is linked to active Visitor."
                    });
                    return dto;
                }
            }
            if (dto.transtatus.lstErrorItem.Count == 0)
            {
                DbContext.Countries.Update(dto.Country);
                await DbContext.SaveChangesAsync();
                dto.transtatus.result = true;
                dto.Countries = DbContext.Countries.ToList();
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "Updated Successfully"
                   }
               );
            }
            return dto;
        }
        public void ValidateCountryForCreate(CountryDTO dto)
        {
            try
            {
                string countryname = dto.Country.CountryName;

                //6.check in the country table whether country name is already given, show error as "country Name A already Exists"
                if (DbContext.Countries.Any(x => x.CountryName == countryname))
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VM0000",
                            Message = "Country Name\"" + dto.Country.CountryName + "\" is already exists."
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
        }
        public void ValidateCountryForUpdate(CountryDTO countryDTO)
        {
            try
            {
                dto.transtatus.result = true;
                string countryname = dto.Country.CountryName;
                string countrycode = dto.Country.CountryCode;
                long countryid = dto.Country.CountryId;

                //6.check in the country table whether country name is already given, show error as "country Name A already Exists"
                if (DbContext.Countries.Any(x => x.CountryName == countryname && x.CountryId != countryid))
                {
                    dto.transtatus.result = false;
                    countryDTO.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VM0000",
                            Message = "Country Name\"" + dto.Country.CountryName + "\" is already exists."
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
        }
        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "4";
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