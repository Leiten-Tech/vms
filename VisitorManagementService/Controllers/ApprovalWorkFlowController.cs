using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Services.ApprovalWorkflow;

namespace VisitorManagementMySQL.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[Controller]")]
    public class ApprovalWorkFlowController : ControllerBase
    {
        private readonly IApprovalWorkFlow service;

        public ApprovalWorkFlowController(IApprovalWorkFlow _service)
        {
            service = _service;
        }

        [HttpPost("ApprovalWorkFlowUpdate")]
        [AllowAnonymous]
        public async Task<IActionResult> ApprovalWorkFlowUpdate(JObject input)
        {
            try
            {
                return Ok(await service.ApprovalWorkFlowUpdate(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("AndroidApprovalWorkFlowUpdate")]
        [AllowAnonymous]
        public async Task<IActionResult> AndroidApprovalWorkFlowUpdate(JObject input)
        {
            try
            {
                return Ok(await service.AndroidApprovalWorkFlowUpdate(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("UserWorkFlowUpdate")]
        public IActionResult UserWorkFlowUpdate(JObject input)
        {
            try
            {
                return Ok(service.UserWorkFlowUpdateAsync(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("MailApproval/{token}")]
        [AllowAnonymous]
        public async Task<IActionResult> UserWorkFlowUpdateUsingToken(string token)
        {
            try
            {
                return Ok(await service.UserWorkFlowUpdateUsingToken(token));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("Encrypt/{value}")]
        [AllowAnonymous]
        public IActionResult EncryptData(string value)
        {
            try
            {
                return Ok(service.EncryptData(value));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("DSendPass/{token}")]
        [AllowAnonymous]
        public IActionResult DSendPass(string token)
        {
            try
            {
                return Ok(service.DSendPass(token));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("DecryptData/{token}")]
        [AllowAnonymous]
        public IActionResult DecryptData(string token)
        {
            try
            {
                return Ok(service.DecryptData(token));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("poppupfetch")]
        public async Task<IActionResult> Popupfetch(JObject input)
        {
            try
            {
                return Ok(await service.Popupfetch(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("checkOutTimer")]
        public async Task<IActionResult> checkOutTimer(JObject input)
        {
            try
            {
                return Ok(await service.checkOutTimer(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("poppupupdate")]
        public async Task<IActionResult> poppupupdate(JObject input)
        {
            try
            {
                return Ok(await service.poppupupdate(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("SendPass")]
        public IActionResult SendPass(VisitorEntry input, string SendMail)
        {
            try
            {
                return Ok(service.SendPass(input, SendMail, "",""));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
