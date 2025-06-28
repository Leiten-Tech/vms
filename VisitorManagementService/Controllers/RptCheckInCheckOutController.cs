using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using VisitorManagementMySQL.Services.Reports.RptCheckInCheckOutService;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Authorization;

namespace VisitorManagementMySQL.Controllers
{
    
    [ApiController]
    [Route("[Controller]")]
    [Authorize]
    public class RptCheckInCheckOutController : ControllerBase
    {
        private readonly IRptCheckInCheckOutService rptCheckInCheckOutService;

        public RptCheckInCheckOutController(IRptCheckInCheckOutService _rptCheckInCheckOutService)
        {
            rptCheckInCheckOutService = _rptCheckInCheckOutService;
        }
       [HttpPost("SearchInitialize")]
        public async Task<IActionResult> SearchInitialize(JObject input)
        {
            try
            {
                return Ok(await rptCheckInCheckOutService.SearchInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        //  [HttpPost("OnChangeVisitor")]

        // public async Task<IActionResult> OnChangeVisitor(JObject input)
        // {
        //     try
        //     {
        //         return Ok(await rptCheckInCheckOutService.OnChangeVisitor(input));
        //     }
        //     catch (Exception ex)
        //     {
        //         return BadRequest(new { message = ex.Message });
        //     }
        // }
         [HttpPost("CreateInitialize")]

        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await rptCheckInCheckOutService.CreateInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
    }
}