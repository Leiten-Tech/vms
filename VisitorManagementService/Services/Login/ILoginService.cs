using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Entities;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Http;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Services.Login
{
    public interface ILoginService
    {
        Task<LoginDTO> Login(JObject obj);
        Task<LoginDTO> LogOut(JObject obj);
        Task<LoginDTO> getHeaderGate(JObject obj);
             Task<LoginDTO> AndroidLogin(JObject obj);
            Task<LoginDTO> AndroidLogOut(JObject obj);
            Task<LoginDTO> AndroidVisitorRegistration(IFormFile image, JObject obj);
            Task<LoginDTO> AndroidMyProfileEdit(JObject obj);
            Task<LoginDTO> AndroidMyProfileImageEdit(IFormFile image, string mobileno);
            Task<LoginDTO> AndroidChangePassword(ChangePasswordRequest changePasswordRequest);
            Task SaveDeviceTokenAsync(DeviceTokenDTO deviceTokenDto);
          Task RemoveInvalidTokensAsync(string mobileNumber);
           Task<List<Userdevicetoken>> GetDeviceTokensAsync(string mobileNumber);
        }
    }
