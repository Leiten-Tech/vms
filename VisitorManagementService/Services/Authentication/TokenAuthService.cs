using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Services.Authentication
{
    public class TokenAuthService : ITokenAuthService
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly string keys = "64A63153-11C1-4919-9133-EFAF99A9B456";
        private readonly MailSettings _mailSettings;

        public TokenAuthService(
            IHttpContextAccessor _httpContextAccessor,
            IOptions<MailSettings> mailSettings
        )
        {
            httpContextAccessor = _httpContextAccessor;
            _mailSettings = mailSettings.Value;
        }

        public string Authentication(User user, Company userCompany, string role, string apiresult)
        {
            // 1. Create Security Token Handler
            var tokenHandler = new JwtSecurityTokenHandler();
            // 2. Create Private Key to Encrypted
            var tokenKey = Encoding.ASCII.GetBytes(keys);
            string id = Guid.NewGuid().ToString();

            //3. Create JETdescriptor
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(
                    new Claim[]
                    {
                        new Claim(type: "UserId", value: user.UserId.ToString()),
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim("TrialLicense", apiresult),
                        new Claim("DefaultRole", role),
                        new Claim(ClaimTypes.NameIdentifier, id.ToString()),
                        new Claim(
                            ClaimTypes.Expiration,
                            DateTime.UtcNow.AddDays(1).ToString("MMM ddd dd yyyy HH:mm:ss tt")
                        ),
                    }
                ),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKey),
                    SecurityAlgorithms.HmacSha256Signature
                ),
            };
            //4. Create Token
            var token = tokenHandler.CreateToken(tokenDescriptor);
            // 5. Convert To Base64
            string plainText = tokenHandler.WriteToken(token);
            // 5. Return Token from method
            var result = plainText;
            return result;
        }
    }
}
