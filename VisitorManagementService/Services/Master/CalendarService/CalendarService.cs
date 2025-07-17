using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Master.CalendarService
{
    public class CalendarService : ICalendarService
    {
        private readonly CalendarDto dto;
        private readonly IDapperContext dapperContext;

        public CalendarService(IDapperContext _dapperContext)
        {
            dto = new CalendarDto();
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }

        public async Task<object> FetchAppointment(JObject obj)
        {
            try
            {
                
                string Type = "FetchAppointment";
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long UserId = obj["UserId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();

                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_CALENDAR_SI", new
                    {
                        Type,
                        CompanyId,
                        UserId,
                        PlantId
                    });

                    dto.AppointmentList = (await spcall.ReadAsync<dynamic>()).ToList();
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

    }
}