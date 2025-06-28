using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using WhatsAppIntegration.Services.WhatsAppService;

namespace WhatsAppIntegration.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class WIntegrationController : ControllerBase
    {
        private readonly IWhatsAppService wIntegrationService;
        public WIntegrationController(IWhatsAppService _wIntegrationService)
        {
            wIntegrationService = _wIntegrationService;
        }
        [HttpPost("WCallApi")]
        [AllowAnonymous]
        public async Task<IActionResult> WCallApi(JObject input)
        {
            try
            {
                return Ok(await wIntegrationService.WCallApi(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}