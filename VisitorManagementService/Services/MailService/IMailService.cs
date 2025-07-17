using System;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using VisitorManagementMySQL.ContextHelper;
using Newtonsoft.Json.Linq;

namespace VisitorManagementMySQL.Services.MailService
{
    public interface IMailService
    {
        Task SendApprovalReqEmail(object obj, long? companyId, Company company);
        //******Start Android*******
                Task<MailDTO> SendOTPEmail(string UserName,DateTime expirytime,string email, string otp,string type);
        Task<MailDTO> SendOtp(string email,string type,string mobileno);
        Task<MailDTO> VerifyOTP(OTPVerifyRequest request);
           //******END Android*******
    }
}