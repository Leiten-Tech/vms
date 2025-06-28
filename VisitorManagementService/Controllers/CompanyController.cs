using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.CompanyService;


namespace VisitorManagementMySQL.Controllers
{
    [ApiController]
    [Route("[Controller]")]
     [Authorize]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService companyService;

        public CompanyController(ICompanyService _companyService)
        {
            companyService = _companyService;
        }

        [HttpPost("CreateInitialize")]

        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await companyService.CreateInitialize(input));
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
                return Ok(await companyService.OnChangeCountry(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangeState")]
        public async Task<IActionResult> OnChangeState(JObject input)
        {
            try
            {
                return Ok(await companyService.OnChangeState(input));
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
                return Ok(await companyService.Create(input));
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

                return Ok(await companyService.Update(input));
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
                return Ok(await companyService.ChangeStatus(input));
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
                return Ok(await companyService.SearchInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}