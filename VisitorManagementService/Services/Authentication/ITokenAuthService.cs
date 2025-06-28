using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Services.Authentication
{
    public interface ITokenAuthService
    {
        string Authentication(User user, Company userCompany, string role, string apiresult);
    }
}