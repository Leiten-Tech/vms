using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.DashBoard.IndividualService;

namespace VisitorManagementMySQL.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class IndividualDashBoardController : ControllerBase
    {
        private readonly IIndividualService individualService;
        public IndividualDashBoardController(IIndividualService _individualService)
        {
            individualService = _individualService;
        }
        [HttpPost("SearchInitialize")]
        public async Task<IActionResult> SearchInitialize(JObject input)
        {
            try
            {
                return Ok(await individualService.SearchInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("DashboardOnclick")]
        public async Task<object> DashboardOnclick(JObject obj)
        {
            try
            {
                return Ok(await individualService.DashboardOnclick(obj));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}