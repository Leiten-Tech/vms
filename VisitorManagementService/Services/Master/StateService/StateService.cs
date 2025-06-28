using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;

namespace VisitorManagementMySQL.Services.Master.StateService
{
    public class StateService : IStateService
    {
        private readonly StateDto dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        public StateService(DbContextHelper _dbContextHelper,
         IDapperContext _dapperContext
         )
        {
            dto = new StateDto();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();

        }
        public async Task<object> CreateInitialize(JObject obj)
        {
            int Stateid = obj["Stateid"].ToObject<int>();
            string Type = "CreateInitialize";
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_STATE_CI", new
                    {
                        Type,
                        Stateid
                    });

                    dto.CountryList = (await spcall.ReadAsync<Country>()).ToList();
                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    if (Stateid > 0)
                    {
                        dto.HdrTable = (await spcall.ReadAsync<State>()).SingleOrDefault();
                    }
                }
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
        public async Task<object> Create(JObject obj)
        {
            State State = obj["State"].ToObject<State>();
            try
            {
                var States = DbContext.States.Where(y => y.StateName == State.StateName && y.CountryId == State.CountryId).SingleOrDefault();
                if (States != null)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"State Name \"{States.StateName}\" is already exists. "
                       }
                   );
                    return dto;
                }
                State.StateCode = await GenerateUniqueCode();
                DbContext.States.Add(State);
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
                State State = obj["State"].ToObject<State>();
                long Stateid = State.StateId;
                var States = DbContext.States.Where(y => y.StateName == State.StateName & y.StateId != State.StateId && y.Status == State.Status && y.CountryId == State.CountryId).SingleOrDefault();
                if (States != null)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"State Name \"{States.StateName}\" already exists. "
                       }
                   );
                    return dto;
                }
                if (State.Status != 1)
                {
                    var isexistCity = DbContext.Cities.Where(x => x.StateId == Stateid && x.Status == 1).ToList();
                    if (isexistCity.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            Message = "Inactive not allowed. This State has  active Cities."
                        });
                        return dto;
                    }
                }
                if (State.Status != 1)
                {
                    var isexistState = DbContext.Visitors.Where(x => x.StateId == Stateid && x.Status == 1).ToList();
                    if (isexistState.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(new ErrorItem
                        {
                            Message = "Inactive not allowed. This State has  active Visitors."
                        });
                        return dto;
                    }
                }

                DbContext.States.Update(State);
                await DbContext.SaveChangesAsync();
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                  new ErrorItem
                  {
                      Message = "Updated Successfully"
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

        public async Task<object> ChangeStatus(JObject obj)
        {
            long Stateid = obj["Stateid"].ToObject<long>();
            try
            {
                // State State = DbContext.States.Where(y => y.StateId == Stateid).SingleOrDefault();
                var isexistCity = DbContext.Cities.Where(x => x.StateId == Stateid && x.Status == 1).ToList();
                if (isexistCity.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        Message = "Inactive not allowed. This State has  active Cities."
                    });
                    return dto;
                }
                var isExistsVis = DbContext.Visitors.Where(v => v.StateId == Stateid && v.Status == 1).ToList();
                if (isExistsVis.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(new ErrorItem
                    {
                        ErrorNo = "VMS000",
                        Message = "Inactive not allowed. This State is linked to active Visitor."
                    });
                    return dto;
                }

                State State = DbContext.States.Where(y => y.StateId == Stateid).SingleOrDefault();
                State.Status = 2;
                DbContext.States.Update(State);
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
            int Stateid = obj["Stateid"].ToObject<int>();
            string Type = "SearchInitialize";

            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_STATE_CI", new
                    {
                        Type,
                        Stateid
                    });

                    dto.StateList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "SearchInitialize Successfully"
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
            string documentid = "5";
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