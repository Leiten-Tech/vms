using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Entities;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.Login
{
    public interface ILoginService
    {
        Task<LoginDTO> Login(JObject obj);
        Task<LoginDTO> LogOut(JObject obj);
        Task<LoginDTO> getHeaderGate(JObject obj);
    }
}