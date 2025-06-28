using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using VisitorManagementMySQL.Services.Master.AreaService;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Authorization;

namespace VisitorManagementMySQL.Controllers
{
    
    [ApiController]
    [Route("[Controller]")]
     [Authorize]
    public class AreaController : ControllerBase
    {
        private readonly IAreaService areaService;

        public AreaController(IAreaService _areaService)
        {
            areaService = _areaService;
        }
        [HttpPost("CreateInitialize")]

        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await areaService.CreateInitialize(input));
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
                return Ok(await areaService.Create(input));
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

                return Ok(await areaService.Update(input));
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
                return Ok(await areaService.ChangeStatus(input));
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
                return Ok(await areaService.SearchInitialize(input));
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
                return Ok(await areaService.OnChangeCompany(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
    }
}