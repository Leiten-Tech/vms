using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.CalendarService;

namespace VisitorManagementService.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class CalendarController : ControllerBase
    {
        private readonly ICalendarService calendarService;

        public CalendarController(ICalendarService _calendarService)
        {
            calendarService = _calendarService;
        }

        [HttpPost("FetchAppointment")]
        public async Task<IActionResult> FetchAppointment(JObject input)
        {
            try
            {
                return Ok(await calendarService.FetchAppointment(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
