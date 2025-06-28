using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Services.Master.SupplierService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace VisitorManagementMySQL.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    [Authorize]
    public class SupplierController : ControllerBase

    {
        private readonly ISupplierService SupplierService;

        public SupplierController(ISupplierService _supplierService)
        {
            SupplierService = _supplierService;
        }



        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await SupplierService.CreateInitialize(input));
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
               return Ok(await SupplierService.Create(input));                                                                                                                                                                                                                                                      
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
                return Ok(await SupplierService.ChangeStatus(input));
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
                return Ok(await SupplierService.Update(input));
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
                return Ok(await SupplierService.SearchInitialize(input));
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
                return Ok(await SupplierService.OnChangeCountry(input));
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
                return Ok(await SupplierService.OnChangeState(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
    }


}

