using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.GateService;

namespace VisitorManagementMySQL.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class GateController : ControllerBase
    {
        private readonly IGateService gateService;
        public GateController(IGateService _gateService)
        {
            gateService = _gateService;
        }
        [HttpPost("Create")]
        public async Task<IActionResult> Create(JObject input)
        {
            try
            {
                return Ok(await gateService.Create(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangeCompany")]
        public async Task<IActionResult> OnChangeCompany(JObject input)
        {
            try
            {
                return Ok(await gateService.OnChangeCompany(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await gateService.CreateInitialize(input));
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
                return Ok(await gateService.SearchInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("Update")]
        public async Task<IActionResult> Update(JObject input)
        {
            try
            {

                return Ok(await gateService.Update(input));
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
					return Ok(await gateService.ChangeStatus(input));
				}
				catch (Exception ex)
				{
					return BadRequest(new { message = ex.Message });
				}
			}
    }
}
