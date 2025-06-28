using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Services.Master.Branch;

namespace VisitorManagementMySQL.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class BranchController : ControllerBase
    {
        private readonly IBranchService branchService;

        public BranchController(IBranchService _branchService)
        {
            branchService = _branchService;
        }
         [HttpPost("CreateInitialize")]

        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await branchService.CreateInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
         [HttpPost("Create")]

        public async Task<IActionResult> Create(JObject input)
        {
            try
            {
                return Ok(await branchService.Create(input));
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

                return Ok(await branchService.Update(input));
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
                return Ok(await branchService.ChangeStatus(input));
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
                return Ok(await branchService.SearchInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        
    }
}