using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.PreviewPassService;

namespace VisitorManagementMySQL.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class PreviewPassController : ControllerBase
    {
        private readonly IPreviewPassService previewPassService;
        public PreviewPassController(IPreviewPassService _previewPassService)
        {
            previewPassService = _previewPassService;
        }

        [HttpPost("CreateInitialize")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await previewPassService.CreateInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}