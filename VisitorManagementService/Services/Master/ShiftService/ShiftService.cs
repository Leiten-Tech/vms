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

namespace VisitorManagementMySQL.Services.Master.ShiftService
{
    public class ShiftService : IShiftService
    {
        private readonly ShiftDTO dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        public ShiftService(DbContextHelper _dbContextHelper,
         IDapperContext _dapperContext
         )
        {
            dto = new ShiftDTO();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();

        }
        public async Task<object> CreateInitialize(JObject obj)
        {

            try
            {
                long ShiftId = obj["ShiftId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "CreateInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_SHIFT_CI", new
                    {
                        Type,
                        ShiftId,
                        CompanyId,
                        RoleId,
                        PlantId
                    });
                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.ShiftList = (await spcall.ReadAsync<dynamic>()).ToList();
                    if (ShiftId > 0)
                    {
                        dto.HdrTable = (await spcall.ReadAsync<Shift>()).SingleOrDefault();
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
        public async Task<object> Create(JObject obj)
        {

            try
            {
                Shift Shift = obj["Shift"].ToObject<Shift>();
                Shift.ShiftCode = await GenerateUniqueCode();
                // Shift.ShiftCode = "SFT00001";
                var Shifts = DbContext.Shifts.Where(y => y.ShiftName == Shift.ShiftName && y.CompanyId == Shift.CompanyId).SingleOrDefault();
                var Shiftfromtime = DbContext.Shifts.Where(y => y.ShiftFromTime == Shift.ShiftFromTime && y.CompanyId == Shift.CompanyId).SingleOrDefault();
                var Shifttotime = DbContext.Shifts.Where(y => y.ShiftToTime == Shift.ShiftToTime && y.CompanyId == Shift.CompanyId).SingleOrDefault();

                if (Shifts != null)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"Shift Name :{Shifts.ShiftName} already exists. "
                       }
                   );
                    return dto;
                }
                if (Shiftfromtime != null)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"Shift From Time :{Shiftfromtime.ShiftFromTime} already exists. "
                       }
                   );
                    return dto;
                }
                if (Shifttotime != null)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"Shift To Time :{Shifttotime.ShiftToTime} already exists. "
                       }
                   );
                    return dto;
                }
                DbContext.Shifts.Add(Shift);
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

                Shift Shift = obj["Shift"].ToObject<Shift>();
                var Shifts = DbContext.Shifts.Where(y => y.ShiftName == Shift.ShiftName & y.ShiftId != Shift.ShiftId && y.CompanyId == Shift.CompanyId).SingleOrDefault();
                if (Shifts != null)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                       new ErrorItem
                       {
                           Message = $"Shift Name :{Shifts.ShiftName} already exists. "
                       }
                   );
                    return dto;
                }
                DbContext.Shifts.Update(Shift);
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

            try
            {
                long ShiftId = obj["ShiftId"].ToObject<long>();
                Shift Shift = DbContext.Shifts.Where(y => y.ShiftId == ShiftId).SingleOrDefault();
                Shift.Status = 2;
                DbContext.Shifts.Update(Shift);
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
                long ShiftId = obj["ShiftId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "SearchInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_SHIFT_CI", new
                    {
                        Type,
                        ShiftId,
                        CompanyId,
                        RoleId,
                        PlantId
                    });

                    dto.ShiftList = (await spcall.ReadAsync<dynamic>()).ToList();
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
            string documentid = "10";
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