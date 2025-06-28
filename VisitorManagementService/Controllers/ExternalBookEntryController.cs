using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Services.VisitorManagement.ExternalBookEntryService;
using VisitorManagementMySQL.Services.VisitorManagement.VisitorEntryService;

namespace VisitorManagementMySQL.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class ExternalBookEntryController : ControllerBase
    {
        private readonly IExternalBookEntryService IExternalBookEntryService;

        public ExternalBookEntryController(IExternalBookEntryService _IExternalBookEntryService)
        {
            IExternalBookEntryService = _IExternalBookEntryService;
        }

        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.CreateInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("OnEnterMobileNo")]
        public async Task<IActionResult> OnEnterMobileNo(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.OnEnterMobileNo(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("OnChangePartyType")]
        public async Task<IActionResult> OnChangePartyType(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.OnChangePartyType(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("OnChangeVisitorType")]
        public async Task<IActionResult> OnChangeVisitorType(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.OnChangeVisitorType(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("OnChangeVisitor")]
        public async Task<IActionResult> OnChangeVisitor(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.OnChangeVisitor(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("FilterPreBookinNo")]
        public async Task<IActionResult> FilterPreBookinNo(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.FilterPreBookinNo(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(
            [FromForm] string input,
            [FromForm] IFormFile webfile,
            IFormFile webfile1,
            IFormFile digSign,
            [FromForm] List<IFormFile> webfiles
        )
        {
            try
            {
                var visentry = JObject.Parse(input);
                return Ok(
                    await IExternalBookEntryService.Create(
                        visentry,
                        webfile,
                        webfile1,
                        digSign,
                        webfiles
                    )
                );
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
                return Ok(await IExternalBookEntryService.SearchInitialize(input));
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
                return Ok(await IExternalBookEntryService.ChangeStatus(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("Update")]
        public async Task<IActionResult> Update(
            [FromForm] string input,
            [FromForm] IFormFile webfile,
            IFormFile webfile1,
            IFormFile digSign,
            [FromForm] List<IFormFile> webfiles
        )
        {
            try
            {
                var visentry = JObject.Parse(input);
                return Ok(
                    await IExternalBookEntryService.Update(
                        visentry,
                        webfile,
                        webfile1,
                        digSign,
                        webfiles
                    )
                );
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("UpdateImage")]
        public async Task<IActionResult> UpdateImage(
            [FromForm] string input,
            [FromForm] IFormFile webfile,
            IFormFile webfile1,
            [FromForm] List<IFormFile> webfiles
        )
        {
            try
            {
                var visentry = JObject.Parse(input);
                return Ok(
                    await IExternalBookEntryService.UpdateImage(
                        visentry,
                        webfile,
                        webfile1,
                        webfiles
                    )
                );
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("CheckinCkeckoutPageLoad")]
        public async Task<IActionResult> CheckinCkeckoutPageLoad(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.CheckinCkeckoutPageLoad(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("FilterVehicleNo")]
        public async Task<IActionResult> FilterVehicleNo(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.FilterVehicleNo(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("FilterDriver")]
        public async Task<IActionResult> FilterDriver(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.FilterDriver(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("FilterVisitorEntryCode")]
        public async Task<IActionResult> FilterVisitorEntryCode(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.FilterVisitorEntryCode(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("OnChangeVisitorEntryCode")]
        public async Task<IActionResult> OnChangeVisitorEntryCode(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.OnChangeVisitorEntryCode(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("OnChangeVehicleNo")]
        public async Task<IActionResult> OnChangeVehicleNo(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.OnChangeVehicleNo(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("OnChangeExistVehicleNo")]
        public async Task<IActionResult> OnChangeExistVehicleNo(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.OnChangeExistVehicleNo(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("CheckOut")]
        public async Task<IActionResult> CheckOut(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.CheckOut(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("CheckIn")]
        public async Task<IActionResult> CheckIn(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.CheckIn(input));
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
                return Ok(await IExternalBookEntryService.OnChangePlant(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("OnChangeDepartment")]
        public async Task<IActionResult> OnChangeDepartment(JObject input)
        {
            try
            {
                return Ok(await IExternalBookEntryService.OnChangeDepartment(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
