using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.CatetoryCPMappingService;

namespace VisitorManagementMySQL.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("[Controller]")]    
    public class CategoryCPMappingController : ControllerBase
    {
        private readonly ICategoryCPMappingService categoryCPMappingService;
        public CategoryCPMappingController(ICategoryCPMappingService _categoryCPMappingService)
        {
            categoryCPMappingService = _categoryCPMappingService;
        }

        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await categoryCPMappingService.CreateInitialize(input));
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
                return Ok(await categoryCPMappingService.SearchInitialize(input));
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
                return Ok(await categoryCPMappingService.Create(input));
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

                return Ok(await categoryCPMappingService.Update(input));
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
                return Ok(await categoryCPMappingService.ChangeStatus(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

         [HttpPost("FilterCategory")]
        public async Task<IActionResult> FilterCategory(JObject input)
        {
            try
            {
                return Ok(await categoryCPMappingService.FilterCategory(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}