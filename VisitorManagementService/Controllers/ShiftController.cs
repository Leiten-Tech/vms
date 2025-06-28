using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.ShiftService;

namespace VisitorManagementMySQL.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    [Authorize]
    public class ShiftController : ControllerBase
    {
        private readonly IShiftService shiftService;

        public ShiftController(IShiftService _shiftService)
        {
            shiftService = _shiftService;
        }
        [HttpPost("CreateInitialize")]

        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await shiftService.CreateInitialize(input));
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
                return Ok(await shiftService.Create(input));
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

                return Ok(await shiftService.Update(input));
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
                return Ok(await shiftService.ChangeStatus(input));
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
                return Ok(await shiftService.SearchInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}