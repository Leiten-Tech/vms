using System;
using System.Threading.Tasks;
using VisitorManagementMySQL.Services.Master.NumberingSchemaService;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class NumberingSchemaController:ControllerBase
    {
        private readonly INumberingSchemaService numberingschemaService;
        public NumberingSchemaController(INumberingSchemaService _numberingschemaService)
        {
            numberingschemaService=_numberingschemaService;
        }

        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await numberingschemaService.CreateInitialize(input));
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
                return Ok(await numberingschemaService.Create(input));
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

                return Ok(await numberingschemaService.Update(input));
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
                return Ok(await numberingschemaService.ChangeStatus(input));
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
                return Ok(await numberingschemaService.SearchInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        
    }
}