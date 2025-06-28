using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.CityService;

namespace VisitorManagementMySQL.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class CityController : ControllerBase
    {
        private readonly ICityService cityService;
        public CityController(ICityService _cityService)
        {
            cityService = _cityService;
        }
        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await cityService.CreateInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangeCountry")]
        public async Task<IActionResult> OnChangeCountry(JObject input)
        {
            try
            {
                return Ok(await cityService.OnChangeCountry(input));
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
                return Ok(await cityService.SearchInitialize(input));
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
                return Ok(await cityService.Create(input));
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

                return Ok(await cityService.Update(input));
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
                return Ok(await cityService.ChangeStatus(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
