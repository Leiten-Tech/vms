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
        public async Task<IActionResult> Update([FromForm] string input, [FromForm] IFormFile webfile,  IFormFile webfile1, [FromForm] List<IFormFile> webfiles)
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

    }
}