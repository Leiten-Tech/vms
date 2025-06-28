using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.InstructionsService;

namespace VisitorManagementMySQL.Controllers
{

     [ApiController]
    [Route("[Controller]")]
     //[Authorize]
    public class InstructionsController : ControllerBase
    {
        private readonly IInstructionsService instructionsService;

        public InstructionsController(IInstructionsService _instructionsService)
        {
            instructionsService = _instructionsService;
        }

         [HttpPost("CreateInitialize")]

        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await instructionsService.CreateInitialize(input));
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
                return Ok(await instructionsService.OnChangeCompany(input));
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
                return Ok(await instructionsService.Create(input));
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

                return Ok(await instructionsService.Update(input));
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
                return Ok(await instructionsService.ChangeStatus(input));
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
                return Ok(await instructionsService.SearchInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}