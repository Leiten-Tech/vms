using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;

namespace VisitorManagementMySQL.Services.Master.CityService
{
    public class CityService : ICityService
    {
        private readonly CityDto dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        public CityService(DbContextHelper _dbContextHelper, IDapperContext _dapperContext)
        {
            dto = new CityDto();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();

        }
        public async Task<object> CreateInitialize(JObject obj)
        {
            try
            {
                int CityId = obj["CityId"].ToObject<int>();
                string Type = "CreateInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_CITY_CI", new
                    {
                        Type,
                        CityId,
                        CountryId=(object)null
                    });
                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.CountryList = (await spcall.ReadAsync<Country>()).ToList();
                    if (CityId > 0)
                    {
                        dto.StateList = (await spcall.ReadAsync<State>()).ToList();
                        dto.HdrTable = (await spcall.ReadAsync<City>()).SingleOrDefault();
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
        public async Task<Object> OnChangeCountry(JObject obj)
        {
            try
            {
                string CountryId = obj["CountryId"].ToObject<string>();
                string Type = "OnChangeCountry";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_CITY_CI", new
                    {
                        Type,
                        CityId=(object)null,
                        CountryId,
                    });
                    dto.StateList = (await spcall.ReadAsync<State>()).ToList();
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
                int CityId = obj["CityId"].ToObject<int>();
                string Type = "SearchInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_CITY_CI", new
                    {
                        Type,
                        CityId,
                        CountryId=(object)null
                    });

                    dto.CityList = (await spcall.ReadAsync<dynamic>()).ToList();
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
                City CityMaster = obj["City"].ToObject<City>();
                string CityName = CityMaster.CityName;
                var cityName = DbContext.Cities.Where(c => c.CityName == CityMaster.CityName && c.CountryId == CityMaster.CountryId && c.StateId == CityMaster.StateId).ToList();
                if (cityName.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "City name\"" + CityName + "\"is already exists."
                    });
                    return dto;
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    //Autogenerate citycode
                    CityMaster.CityCode = await GenerateUniqueCode();
                    DbContext.Cities.Add(CityMaster);
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
                City City = obj["City"].ToObject<City>();
                long CityId = City.CityId;
                string CityName = City.CityName;
                //if CityName is already exists it show error
                var cityName = DbContext.Cities.Where(c => c.CityName == City.CityName && c.CountryId == City.CountryId && c.StateId == City.StateId && c.CityId != City.CityId).ToList();
                if (cityName.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "City name\"" + CityName + "\"is already exists."
                    });
                    return dto;
                }
                if (City.Status != 1)
                {
                    var isexistcom = DbContext.Companies.Where(x => x.CityId == CityId && x.Status == 1).ToList();
                    if (isexistcom.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            Message = "Inactive not allowed. This City is linked to active Companies."
                        });
                        return dto;
                    }
                    var isexistcus = DbContext.Customers.Where(x => x.CityId == CityId && x.Status == 1).ToList();
                    if (isexistcus.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            Message = "Inactive not allowed. This City is linked to active Customers."
                        });
                        return dto;
                    }
                    var isexistsupp = DbContext.Suppliers.Where(x => x.CityId == CityId && x.Status == 1).ToList();
                    if (isexistsupp.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            Message = "Inactive not allowed. This City is linked to active Suppliers."
                        });
                        return dto;
                    }
                    var isexistvis = DbContext.Visitors.Where(x => x.CityId == CityId && x.Status == 1).ToList();
                    if (isexistvis.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            Message = "Inactive not allowed. This City is linked to active Visitors."
                        });
                        return dto;
                    }

                   
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    DbContext.Cities.Update(City);
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
            int Cityid = obj["CityId"].ToObject<int>();
            try
            {
                var isexistcom = DbContext.Companies.Where(x => x.CityId == Cityid && x.Status == 1).ToList();
                if (isexistcom.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        Message = "Inactive not allowed. This City is linked to active Companies."
                    });
                    return dto;
                }
                var isexistcus = DbContext.Customers.Where(x => x.CityId == Cityid && x.Status == 1).ToList();
                if (isexistcus.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        Message = "Inactive not allowed. This City is linked to active Customers."
                    });
                    return dto;
                }
                var isexistsupp = DbContext.Suppliers.Where(x => x.CityId == Cityid && x.Status == 1).ToList();
                if (isexistsupp.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        Message = "Inactive not allowed. This City is linked to active Suppliers."
                    });
                    return dto;
                }
                var isexistvis = DbContext.Visitors.Where(x => x.CityId == Cityid && x.Status == 1).ToList();
                if (isexistvis.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        Message = "Inactive not allowed. This City is linked to active Visitors."
                    });
                    return dto;
                }
                var isExistsVis = DbContext.Visitors.Where(v => v.CityId == Cityid && v.Status == 1).ToList();
                if (isExistsVis.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "Inactive not allowed. This City is linked to active Visitor."
                    });
                    return dto;
                }

                City CityMaster = DbContext.Cities.Where(y => y.CityId == Cityid).SingleOrDefault();
                CityMaster.Status = 2;
                DbContext.Cities.Update(CityMaster);
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
        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "17";
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



