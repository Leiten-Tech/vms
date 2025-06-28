using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Entities;

namespace VisitorManagementMySQL.Services.Master.CalendarService
{
    public interface ICalendarService
    {
        Task<object> FetchAppointment(JObject input);

    }
}