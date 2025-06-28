using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.VisitorManagement.WorkPermitService;

namespace VisitorManagementMySQL.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class WorkPermitController : ControllerBase
    {
        private readonly IWorkPermitService workPermitService;

        public WorkPermitController(IWorkPermitService _workPermitService)
        {
            workPermitService = _workPermitService;
        }

        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await workPermitService.CreateInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(
            [FromForm] string input,
            [FromForm] List<IFormFile> companyFiles,
            [FromForm] List<IFormFile> workerFiles
        )
        {
            try
            {
                var workPermit = JObject.Parse(input);
                return Ok(await workPermitService.Create(workPermit, companyFiles, workerFiles));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("Update")]
        public async Task<IActionResult> Update(
            [FromForm] string input,
            [FromForm] List<IFormFile> companyFiles,
            [FromForm] List<IFormFile> workerFiles
        )
        {
            try
            {
                var workPermit = JObject.Parse(input);
                return Ok(await workPermitService.Update(workPermit, companyFiles, workerFiles));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("UpdateImage")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateImage(
            [FromForm] string input,
            [FromForm] List<IFormFile> workerFiles
        )
        {
            try
            {
                var workPermit = JObject.Parse(input);
                return Ok(await workPermitService.UpdateImage(workPermit, workerFiles));
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
                return Ok(await workPermitService.SearchInitialize(input));
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
                return Ok(await workPermitService.ChangeStatus(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("FetchVendor")]
        public async Task<IActionResult> FetchVendor(JObject input)
        {
            try
            {
                return Ok(await workPermitService.FetchVendor(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("OnChangeVendor")]
        public async Task<IActionResult> OnChangeVendor(JObject input)
        {
            try
            {
                return Ok(await workPermitService.OnChangeVendor(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("FetchCheckPoints")]
        public async Task<IActionResult> FetchCheckPoints(JObject input)
        {
            try
            {
                return Ok(await workPermitService.FetchCheckPoints(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("GetWpPass")]
        [AllowAnonymous]
        public async Task<IActionResult> GetWpPass(JObject input)
        {
            try
            {
                return Ok(await workPermitService.GetWpPass(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("FilterWorkPermitCode")]
        [AllowAnonymous]
        public async Task<IActionResult> FilterWorkPermitCode(JObject input)
        {
            try
            {
                return Ok(await workPermitService.FilterWorkPermitCode(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("CheckOutWp")]
        [AllowAnonymous]
        public async Task<IActionResult> CheckOut(JObject input)
        {
            try
            {
                return Ok(await workPermitService.CheckOut(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("CheckInWp")]
        [AllowAnonymous]
        public async Task<IActionResult> CheckIn(JObject input)
        {
            try
            {
                return Ok(await workPermitService.CheckIn(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
