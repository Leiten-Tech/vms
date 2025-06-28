using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.WIntegrationService;

namespace VisitorManagementMySQL.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class WIntegrationController : ControllerBase
    {
        private readonly IWIntegrationService wIntegrationService;
        public WIntegrationController(IWIntegrationService _wIntegrationService)
        {
            wIntegrationService = _wIntegrationService;
        }
        [HttpPost("WApproval")]
        [AllowAnonymous]
        public async Task<IActionResult> WApproval(JObject input)
        {
            try
            {
                return Ok(await wIntegrationService.WApproval(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}