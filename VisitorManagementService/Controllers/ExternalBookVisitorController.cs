using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.VisitorService;
using VisitorManagementMySQL.Services.Master.ExternalBookVisitorService;

namespace VisitorManagementMySQL.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class ExternalBookVisitorController : ControllerBase
    {
        private readonly IExternalBookVisitorService IExternalBookVisitorService;
        public ExternalBookVisitorController(IExternalBookVisitorService _IExternalBookVisitorService)
        {
            IExternalBookVisitorService = _IExternalBookVisitorService;
        }

        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await IExternalBookVisitorService.CreateInitialize(input));
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
                return Ok(await IExternalBookVisitorService.SearchInitialize(input));
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
                return Ok(await IExternalBookVisitorService.Create(visentry, webfile, webfile1, webfiles));
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
                return Ok(await IExternalBookVisitorService.Update(visentry, webfile, webfile1, webfiles));
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
                return Ok(await IExternalBookVisitorService.ChangeStatus(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangeCountry")]
        public async Task<IActionResult> OnChangeCountry(JObject input)
        {
            try
            {
                return Ok(await IExternalBookVisitorService.OnChangeCountry(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangeState")]
        public async Task<IActionResult> OnChangeState(JObject input)
        {
            try
            {
                return Ok(await IExternalBookVisitorService.OnChangeState(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}