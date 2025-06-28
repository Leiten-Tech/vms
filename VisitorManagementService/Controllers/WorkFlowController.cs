using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.WorkFlowService;

namespace VisitorManagementMySQL.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class WorkFlowController : ControllerBase
    {
        private readonly IWorkFlowService workFlowService;
        public WorkFlowController(IWorkFlowService _workFlowService)
        {
            workFlowService = _workFlowService;
        }
        [HttpPost("SearchInitialize")]
        public async Task<IActionResult> SearchInitialize(JObject input)
        {
            try
            {
                return Ok(await workFlowService.SearchInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("ApprovalView")]
        public async Task<IActionResult> ApprovalView(JObject input)
        {
            try
            {
                return Ok(await workFlowService.ApprovalView(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}