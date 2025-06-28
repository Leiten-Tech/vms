using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.MaterialService;
using Microsoft.AspNetCore.Http;

namespace VisitorManagementMySQL.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class MaterialController : ControllerBase
    {
        private readonly IMaterialService materialService;
        public MaterialController(IMaterialService _materialService)
        {
            materialService = _materialService;
        }
        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await materialService.CreateInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangeMaterialType")]
        public async Task<IActionResult> OnChangeMaterialType(JObject input)
        {
            try
            {
                return Ok(await materialService.OnChangeMaterialType(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangeMaterialCatagory")]
        public async Task<IActionResult> OnChangeMaterialCatagory(JObject input)
        {
            try
            {
                return Ok(await materialService.OnChangeMaterialCatagory(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangeMaterialSubCatagory")]
        public async Task<IActionResult> OnChangeMaterialSubCatagory(JObject input)
        {
            try
            {
                return Ok(await materialService.OnChangeMaterialSubCatagory(input));
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
                return Ok(await materialService.SearchInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromForm] string input, [FromForm] IFormFile webfile)
        {
            try
            {
                var Material = JObject.Parse(input);
                return Ok(await materialService.Create(Material,webfile));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromForm] string input, [FromForm] IFormFile webfile)
        {
            try
            {
                var Material = JObject.Parse(input);
                return Ok(await materialService.Update(Material,webfile));
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
                return Ok(await materialService.ChangeStatus(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}