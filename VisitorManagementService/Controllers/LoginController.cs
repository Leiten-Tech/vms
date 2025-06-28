using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.Login;

namespace VisitorManagementMySQL.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService ILoginService;
        public LoginController(ILoginService _ILoginService)
        {
            ILoginService = _ILoginService;
        }
        [HttpPost("Login")]

        public async Task<IActionResult> Login(JObject input)
        {
            try
            {
                return Ok(await ILoginService.Login(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("LogOut")]
        public async Task<IActionResult> LogOut(JObject input)
        {
            try
            {
                return Ok(await ILoginService.LogOut(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("GetHeaderGate")]
        public async Task<IActionResult> getHeaderGate(JObject input)
        {
            try
            {
                return Ok(await ILoginService.getHeaderGate(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}