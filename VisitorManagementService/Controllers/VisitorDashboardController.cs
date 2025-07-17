using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.DashBoard.VisitorDashboardService;

namespace VisitorManagementMySQL.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class VisitorDashboardController : ControllerBase
    {
        private readonly IVisitorDashboardService VisitorDashboardService;
        public VisitorDashboardController(IVisitorDashboardService _VisitorDashboardService)
        {
            VisitorDashboardService = _VisitorDashboardService;
        }
        [HttpPost("SearchInitialize")]
        public async Task<IActionResult> SearchInitialize(JObject input)
        {
            try
            {
                return Ok(await VisitorDashboardService.SearchInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}