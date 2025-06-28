using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Master.UserService;
using Microsoft.AspNetCore.Http;

namespace VisitorManagementMySQL.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService userService;

        public UserController(IUserService _userService)
        {
            userService = _userService;
        }
        [HttpPost("CreateInitialize")]

        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await userService.CreateInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("Create")]

        public async Task<IActionResult> Create([FromForm] string input, [FromForm] IFormFile webfile, IFormFile digitalSign)
        {
            try
            {
                var user = JObject.Parse(input);
                return Ok(await userService.Create(user, webfile, digitalSign));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromForm] string input, [FromForm] IFormFile webfile, IFormFile digitalSign)
        {
            try
            {
                var user = JObject.Parse(input);
                return Ok(await userService.Update(user, webfile, digitalSign));
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
                return Ok(await userService.ChangeStatus(input));
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
                return Ok(await userService.SearchInitialize(input));
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
                return Ok(await userService.OnChangeCompany(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("OnChangePlant")]
        public async Task<IActionResult> OnChangePlant(JObject input)
        {
            try
            {
                return Ok(await userService.OnChangePlant(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("ScreenMapping")]
        public async Task<IActionResult> ScreenMapping(JObject input)
        {
            try
            {
                return Ok(await userService.ScreenMapping(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}