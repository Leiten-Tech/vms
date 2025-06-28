using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;
using System.Text.RegularExpressions;

namespace VisitorManagementMySQL.Services.Master.CompanyService
{
    public class CompanyService : ICompanyService
    {
        private readonly CompanyDto dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        public CompanyService(DbContextHelper _dbContextHelper,
         IDapperContext _dapperContext
         )
        {
            dto = new CompanyDto();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();

        }

        public async Task<object> CreateInitialize(JObject obj)
        {

            try
            {
                long CompanyId = obj["CompanyId"].ToObject<long>();
                string Type = "CreateInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_COMPANY_CI", new
                    {
                        Type,
                        CompanyId,
                        CountryId=(Object)null,
                        StateId=(Object)null
                    });

                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.CountryList = (await spcall.ReadAsync<Country>()).ToList();
                    if (CompanyId > 0)
                    {
                        dto.StateList = (await spcall.ReadAsync<State>()).ToList();
                        dto.CityList = (await spcall.ReadAsync<City>()).ToList();
                        dto.HdrTable = (await spcall.ReadAsync<Company>()).SingleOrDefault();
                    }

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

        public async Task<Object> OnChangeCountry(JObject obj)
        {
            try
            {
                string CountryId = obj["CountryId"].ToObject<string>();
                string Type = "OnChangeCountry";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_COMPANY_CI", new
                    {
                        Type,
                        CompanyId=(Object)null,
                        CountryId,
                        StateId=(Object)null
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

        public async Task<Object> OnChangeState(JObject obj)
        {
            try
            {
                string StateId = obj["StateId"].ToObject<string>();
                string Type = "OnChangeState";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_COMPANY_CI", new
                    {
                        Type,
                        CompanyId=(Object)null,
                        CountryId=(Object)null,
                        StateId,
                    });
                    dto.CityList = (await spcall.ReadAsync<City>()).ToList();
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
        public async Task<object> Create(JObject obj)
        {

            try
            {
                Company Company = obj["Company"].ToObject<Company>();
                Company.CompanyCode = await GenerateUniqueCode();
                var Companys = DbContext.Companies.Where(y => y.CompanyName == Company.CompanyName).SingleOrDefault();
                if (Companys != null)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"Company Name :{Companys.CompanyName}  already exists. "
                       }
                   );
                    return dto;
                }

                DbContext.Companies.Add(Company);
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

        public async Task<object> Update(JObject obj)
        {
            try
            {
                Company Company = obj["Company"].ToObject<Company>();
                var Companys = DbContext.Companies.Where(y => y.CompanyName == Company.CompanyName & y.CompanyId != Company.CompanyId).SingleOrDefault();
                if (Companys != null)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"Company Name :{Companys.CompanyName}  already exists. "
                       }
                   );
                    return dto;
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {


                    DbContext.Companies.Update(Company);
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
                long CompanyId = obj["CompanyId"].ToObject<long>();
                var isexistEmp = DbContext.Employees.Where(x => x.CompanyId == CompanyId).ToList();
                if (isexistEmp.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        Message = "Inactive not allowed. This Company is linked to active Employee."
                    });
                    return dto;
                }
                var isexistGates = DbContext.Gates.Where(x => x.CompanyId == CompanyId).ToList();
                if (isexistGates.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        Message = "Inactive not allowed. This Company is linked to active Gate."
                    });
                    return dto;
                }
                var isexistAreas = DbContext.Areas.Where(x => x.CompanyId == CompanyId).ToList();
                if (isexistAreas.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        Message = "Inactive not allowed. This Company is linked to active Area."
                    });
                    return dto;

                }
                var isexistPlants = DbContext.Plants.Where(x => x.CompanyId == CompanyId).ToList();
                if (isexistPlants.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        Message = "Inactive not allowed. This Company is linked to active Plant."
                    });
                    return dto;

                }
                Company Company = DbContext.Companies.Where(y => y.CompanyId == CompanyId).SingleOrDefault();
                Company.Status = 2;
                DbContext.Companies.Update(Company);
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
        public async Task<object> SearchInitialize(JObject obj)
        {

            try
            {
                long CompanyId = obj["CompanyId"].ToObject<long>();
                string Type = "SearchInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_COMPANY_CI", new
                    {
                        Type,
                        CompanyId,
                        CountryId=(Object)null,
                        StateId=(Object)null
                    });

                    dto.CompanyList = (await spcall.ReadAsync<dynamic>()).ToList();
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
        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "14";
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



