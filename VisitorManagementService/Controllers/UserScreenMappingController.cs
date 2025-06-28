using System;
using System.Threading.Tasks;
using VisitorManagementMySQL.Services.Master.UserScreenMappingService;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class UserScreenMappingController : ControllerBase
    {
        private readonly IUserScreenMappingService userScreenMappingScreen;

        public UserScreenMappingController(IUserScreenMappingService _userScreenMappingScreen)
        {
            userScreenMappingScreen = _userScreenMappingScreen;
        }
        [HttpPost("CreateInitialize")]
        public async Task<IActionResult> CreateInitialize(JObject obj)
        {
            return Ok(await userScreenMappingScreen.CreateInitialize(obj));
        }
        [HttpPost("Create")]
        public async Task<IActionResult> Create(JObject obj)
        {
            return Ok(await userScreenMappingScreen.Create(obj));
        }
        [HttpPost("Update")]
        public async Task<object> Update(JObject obj)
        {
            return Ok(await userScreenMappingScreen.Update(obj));
        }
        [HttpPost("GetUser")]
        public async Task<IActionResult> GetUser(JObject obj)
        {
            return Ok(await userScreenMappingScreen.GetUser(obj));
        }
        [HttpPost("GetModuleAndFunction")]
        public async Task<IActionResult> GetModuleAndFunction(JObject obj)
        {
            return Ok(await userScreenMappingScreen.GetModuleAndFunction(obj));
        }
        [HttpPost("SearchInitialize")]
        public async Task<IActionResult> SearchInitialize(JObject obj)
        {
            return Ok(await userScreenMappingScreen.SearchInitialize(obj));
        }
    }
}