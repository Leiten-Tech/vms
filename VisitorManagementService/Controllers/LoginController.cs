using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Entities;
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
        //Android Login 
               [HttpPost("AndroidLogin")]
        public async Task<IActionResult> AndroidLogin(JObject input)
        {
            try
            {
                return Ok(await ILoginService.AndroidLogin(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("Visitorregistration")]
        public async Task<IActionResult> AndroidVisitorRegistration([FromForm] IFormFile files, [FromForm] string stringreg)
        {
            try
            {
                var registration = JObject.Parse(stringreg);
                return Ok(await ILoginService.AndroidVisitorRegistration(files, registration));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("AndroidMyProfileEdit")]
        public async Task<IActionResult> AndroidMyProfileEdit(JObject input)
        {
            try
            {
                return Ok(await ILoginService.AndroidMyProfileEdit(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("AndroidMyProfileImageEdit")]
        public async Task<IActionResult> AndroidMyProfileImageEdit(IFormFile image, [FromForm] string mobileno)
        {
            try
            {
                return Ok(await ILoginService.AndroidMyProfileImageEdit(image, mobileno));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("AndroidLogOut")]
        public async Task<IActionResult> AndroidLogOut(JObject input)
        {
            try
            {
                return Ok(await ILoginService.AndroidLogOut(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("AndroidChangePassword")]
        public async Task<IActionResult> AndroidChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                return Ok(await ILoginService.AndroidChangePassword(request));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        
      // POST: api/Login/SaveDeviceToken
        [HttpPost("SaveDeviceToken")]
        public async Task<IActionResult> SaveDeviceToken([FromBody] DeviceTokenDTO deviceTokenDto)
        {
            try
            {
                await ILoginService.SaveDeviceTokenAsync(deviceTokenDto);
                return Ok(new { Message = "Device token saved successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET: api/Login/GetDeviceTokens/{mobileNumber}
        [HttpGet("GetDeviceTokens/{mobileNumber}")]
        public async Task<IActionResult> GetDeviceTokens(string mobileNumber)
        {
            try
            {
                var tokens = await ILoginService.GetDeviceTokensAsync(mobileNumber);
                if (tokens == null || tokens.Count == 0)
                {
                    return NotFound(new { message = "No device tokens found" });
                }
                return Ok(tokens);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // DELETE: api/Login/RemoveInvalidTokens/{mobileNumber}
        [HttpDelete("RemoveInvalidTokens/{mobileNumber}")]
        public async Task<IActionResult> RemoveInvalidTokens(string mobileNumber)
        {
            try
            {
                await ILoginService.RemoveInvalidTokensAsync(mobileNumber);
                return Ok(new { Message = "Invalid tokens removed successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    //End ANDROID****
    }
}