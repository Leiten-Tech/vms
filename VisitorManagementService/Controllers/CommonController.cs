using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Services.Common;

namespace VisitorManagementMySQL.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class CommonController : ControllerBase
    {
        private readonly ICommonService CommonService;
        private readonly DbContextHelper dbContext;

        public CommonController(DbContextHelper _dbContext, ICommonService _CommonService)
        {
            CommonService = _CommonService;
            dbContext = _dbContext;
        }

        // [HttpPost("CheckOutTimer")]
        // public async Task<IActionResult> CheckOutTimer(JObject input)
        // {
        //     try
        //     {
        //         return Ok(await CommonService.SendCheckOutTimer(input));
        //     }
        //     catch (Exception ex)
        //     {
        //         return BadRequest(new { message = ex.Message });
        //     }
        // }
    }
}
