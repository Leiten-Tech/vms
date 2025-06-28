using System;
using System.Threading.Tasks;
using VisitorManagementMySQL.Services.Master.EmployeeService;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace VisitorManagementMySQL.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService employeeservice;
        public EmployeeController(IEmployeeService _employeeservice)
        {
            employeeservice = _employeeservice;
        }
        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject input)
        {
            try
            {
                return Ok(await employeeservice.CreateInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromForm] string input,[FromForm] IFormFile webfile,[FromForm] List<IFormFile> webfiles)
        {
            try
            {
                var employees = JObject.Parse(input);
                return Ok(await employeeservice.Create(employees, webfile,webfiles));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("Update")]
        public async Task<IActionResult> Update([FromForm] string input,[FromForm]  IFormFile webfile,[FromForm] List<IFormFile> webfiles)
        {
            try
            {
                var employees = JObject.Parse(input);
                return Ok(await employeeservice.Update(employees, webfile,webfiles));
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
                return Ok(await employeeservice.ChangeStatus(input));
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
                return Ok(await employeeservice.SearchInitialize(input));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


    }
}