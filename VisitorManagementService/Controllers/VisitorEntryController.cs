using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.VisitorManagement.VisitorEntryService;

namespace VisitorManagementMySQL.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class VisitorEntryController : ControllerBase
    {
        private readonly IVisitorEntryService IVisitorEntryService;
        public VisitorEntryController(IVisitorEntryService _IVisitorEntryService)
        {
            IVisitorEntryService = _IVisitorEntryService;
        }
        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.CreateInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangePartyType")]
        public async Task<IActionResult> OnChangePartyType(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.OnChangePartyType(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangeVisitorType")]
        public async Task<IActionResult> OnChangeVisitorType(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.OnChangeVisitorType(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangeWorkPermit")]
        public async Task<IActionResult> OnChangeWorkPermit(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.OnChangeWorkPermit(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangeVisitor")]
        public async Task<IActionResult> OnChangeVisitor(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.OnChangeVisitor(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("FilterPreBookinNo")]
        public async Task<IActionResult> FilterPreBookinNo(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.FilterPreBookinNo(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromForm] string input, [FromForm] IFormFile webfile, IFormFile webfile1, [FromForm] List<IFormFile> webfiles)
        {
            try
            {
                var visentry = JObject.Parse(input);
                return Ok(await IVisitorEntryService.Create(visentry, webfile, webfile1, webfiles));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("SearchInitialize")]
        public async Task<IActionResult> SearchInitialize(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.SearchInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("ChangeStatus")]
        public async Task<IActionResult> ChangeStatus(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.ChangeStatus(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromForm] string input, [FromForm] IFormFile webfile, IFormFile webfile1, [FromForm] List<IFormFile> webfiles)
        {
            try
            {
                var visentry = JObject.Parse(input);
                return Ok(await IVisitorEntryService.Update(visentry, webfile, webfile1, webfiles));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("CheckinCkeckoutPageLoad")]
        [AllowAnonymous]
        public async Task<IActionResult> CheckinCkeckoutPageLoad(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.CheckinCkeckoutPageLoad(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("FilterVisitorEntryCodeManual")]
        public async Task<IActionResult> FilterVisitorEntryCodeManual(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.FilterVisitorEntryCodeManual(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("FilterVisitorEntryCode")]
        [AllowAnonymous]
        public async Task<IActionResult> FilterVisitorEntryCode(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.FilterVisitorEntryCode(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangeVisitorEntryCode")]
        public async Task<IActionResult> OnChangeVisitorEntryCode(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.OnChangeVisitorEntryCode(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangeEntryDetail")]
        public async Task<IActionResult> OnChangeEntryDetail(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.OnChangeEntryDetail(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("CheckOut")]
        [AllowAnonymous]
        public async Task<IActionResult> CheckOut(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.CheckOut(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("CheckIn")]
        [AllowAnonymous]
        public async Task<IActionResult> CheckIn(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.CheckIn(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("VehicleData")]
        public async Task<IActionResult> VehicleData(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.VehicleData(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangeVisHost")]
        public async Task<IActionResult> OnChangeVisHost(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.OnChangeVisHost(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("ShowPass")]
        [AllowAnonymous]
        public async Task<IActionResult> ShowPass(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.ShowPass(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
                [HttpPost("AndroidVisitorAppointmentPageOnLoad")]
        public async Task<IActionResult> AndroidVisitorAppointmentPageOnLoad(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.AndroidVisitorAppointmentPageOnLoad(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
                 [HttpPost("AndroidHostPersonDetails")]
        public async Task<IActionResult> AndroidHostPersonDetails(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.AndroidHostPersonDetails(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        // [HttpPost("AndroidVisitorAppointmentEntry")]
        // public async Task<IActionResult> AndroidVisitorAppointmentEntry(JObject input)
        // {
        //     try
        //     {
        //         return Ok(await IVisitorEntryService.AndroidVisitorAppointmentEntry(input));
        //     }
        //     catch (Exception ex)
        //     {
        //         return BadRequest(new { message = ex.Message });
        //     }
        // }

        [HttpPost("AndroidVisitorAppointmentEntry")]
        public async Task<IActionResult> AndroidVisitorAppointmentEntry([FromForm] string input, [FromForm] IFormFile webfile)
        {
            try
            {
                var visitorentry = JObject.Parse(input);
                return Ok(await IVisitorEntryService.AndroidVisitorAppointmentEntry(visitorentry, webfile));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("AndroidHostAppointmentDetails")]
        public async Task<IActionResult> AndroidHostAppointmentDetails(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.AndroidHostAppointmentDetails(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("AndroidVisitorAppointmentDetails")]
        public async Task<IActionResult> AndroidVisitorAppointmentDetails(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.AndroidVisitorAppointmentDetails(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("AndroidVisitorPassDetails")]
        public async Task<IActionResult> AndroidVisitorPassDetails(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.AndroidVisitorPassDetails(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("AndroidCheckOut")]
        public async Task<IActionResult> AndroidCheckOut(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.AndroidCheckOut(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("AndroidCheckIn")]
        public async Task<IActionResult> AndroidCheckIn(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.AndroidCheckIn(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("AndroidVisitorRejected")]
        public async Task<IActionResult> AndroidVisitorRejected(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.AndroidVisitorRejected(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("AndroidDashBoard")]
        public async Task<IActionResult> AndroidDashBoard(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.AndroidDashBoard(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("AndroidSecurityDashBoard")]
        public async Task<IActionResult> AndroidSecurityDashBoard(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.AndroidSecurityDashBoard(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("AndroidNotificationDetails")]
        public async Task<IActionResult> AndroidNotificationDetails(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.AndroidNotificationDetails(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("AndroidUpdateNotificationStatus")]
        public async Task<IActionResult> AndroidUpdateNotificationStatus(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.AndroidUpdateNotificationStatus(input));

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("AndroidMeetingClose")]
        public async Task<IActionResult> AndroidMeetingClose(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.AndroidMeetingClose(input));

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("AndroidReschedule")]
        public async Task<IActionResult> AndroidReschedule(JObject input)
        {
            try
            {
                return Ok(await IVisitorEntryService.AndroidReschedule(input));

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}