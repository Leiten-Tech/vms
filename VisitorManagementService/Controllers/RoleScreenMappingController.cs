using System.Threading.Tasks;
using VisitorManagementMySQL.Services.Master.RoleScreenMappingService;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using Microsoft.AspNetCore.Authorization;

namespace VisitorManagementMySQL.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class RoleScreenMappingController : ControllerBase
    {
        private readonly IRoleScreenMappingService roleScreenMappingService;

        public RoleScreenMappingController(IRoleScreenMappingService _roleScreenMappingService)
        {
            roleScreenMappingService = _roleScreenMappingService;
        }
        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject obj)
        {
            try
            {
                return Ok(await roleScreenMappingService.CreateInitialize(obj));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("Create")]
        public async Task<IActionResult> Create(JObject obj)
        {
            try
            {
                return Ok(await roleScreenMappingService.Create(obj));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("Update")]
        public async Task<IActionResult> Update(JObject obj)
        {
             try
            {
            return Ok(await roleScreenMappingService.Update(obj));
             }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("GetDefaultModules")]

        public async Task<IActionResult> GetDefaultModules(JObject obj)
        {
             try
            {
            return Ok(await roleScreenMappingService.GetDefaultModules(obj));
             }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("GetFunctions")]
        public async Task<IActionResult> GetFunctions(JObject obj)
        {
             try
            {
            return Ok(await roleScreenMappingService.GetFunctions(obj));
             }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            

        }
    }
}