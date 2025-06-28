using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.WorkPermitMod.VendorRegService;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace VisitorManagementMySQL.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class VendorRegController : ControllerBase
    {
        private readonly IVendorRegService vendorRegService;
        public VendorRegController(IVendorRegService _vendorRegService)
        {
            vendorRegService = _vendorRegService;
        }

        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await vendorRegService.CreateInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromForm] string input, [FromForm] List<IFormFile> companyFiles, [FromForm] List<IFormFile> workerFiles)
        {
            try
            {
                var vendorReg = JObject.Parse(input);
                return Ok(await vendorRegService.Create(vendorReg, companyFiles, workerFiles));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromForm] string input, [FromForm] List<IFormFile> companyFiles, [FromForm] List<IFormFile> workerFiles)
        {
            try
            {
                var vendorReg = JObject.Parse(input);
                return Ok(await vendorRegService.Update(vendorReg, companyFiles, workerFiles));
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
                return Ok(await vendorRegService.SearchInitialize(input));
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
                return Ok(await vendorRegService.ChangeStatus(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
