using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Entities;

namespace VisitorManagementMySQL.Services.WorkPermitMod.VendorRegService
{
    public interface IVendorRegService
    {
        Task<VendorRegDTO> CreateInitialize(JObject obj);
        Task<VendorRegDTO> Create(object obj, List<IFormFile> companyFiles, List<IFormFile> workerFiles);
        Task<VendorRegDTO> Update(object obj, List<IFormFile> companyFiles, List<IFormFile> workerFiles);
        Task<VendorRegDTO> SearchInitialize(JObject obj);
        Task<VendorRegDTO> ChangeStatus(JObject obj);

    }
}