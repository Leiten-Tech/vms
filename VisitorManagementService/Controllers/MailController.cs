using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using VisitorManagementMySQL.Services.MailService;
using VisitorManagementMySQL.Entities;

namespace VisitorManagementService.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class MailController : ControllerBase
    {
        private readonly IMailService _mailService;

        public MailController(IMailService mailService)
        {
            _mailService = mailService;
        }
        //*****Start Android**********
        [HttpPost("SENDOTP")]
        public async Task<IActionResult> SendOtp([FromBody] OTPRequest request)
        {
            try
            {
                return Ok(await _mailService.SendOtp(request.Email, request.Type, request.mobileno));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("VERIFYOTP")]
        public async Task<IActionResult> VerifyOTP([FromBody] OTPVerifyRequest request)
        {
            try
            {
                return Ok(await _mailService.VerifyOTP(request));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        //*****End Android**********
    }
}
