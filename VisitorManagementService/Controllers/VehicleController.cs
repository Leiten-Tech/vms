using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.VehicleService;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace VisitorManagementMySQL.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleService vehicleService;
        public VehicleController(IVehicleService _vehicleService)
        {
            vehicleService = _vehicleService;
        }
        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await vehicleService.CreateInitialize(input));
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
                return Ok(await vehicleService.SearchInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromForm] string input,[FromForm] List<IFormFile> webfiles)
        {
            try
            {
                var vahicles = JObject.Parse(input);
                return Ok(await vehicleService.Create(vahicles,webfiles));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromForm] string input,[FromForm] List<IFormFile> webfiles)
        {
            try
            {
                var vahicles = JObject.Parse(input);
                return Ok(await vehicleService.Update(vahicles,webfiles));
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
                return Ok(await vehicleService.ChangeStatus(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}