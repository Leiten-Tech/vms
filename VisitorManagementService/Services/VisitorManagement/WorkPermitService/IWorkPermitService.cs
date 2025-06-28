using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Entities;

namespace VisitorManagementMySQL.Services.VisitorManagement.WorkPermitService
{
    public interface IWorkPermitService
    {
        Task<WorkPermitDTO> CreateInitialize(JObject obj);
        Task<WorkPermitDTO> Create(
            object obj,
            List<IFormFile> companyFiles,
            List<IFormFile> workerFiles
        );
        Task<WorkPermitDTO> Update(
            object obj,
            List<IFormFile> companyFiles,
            List<IFormFile> workerFiles
        );
        Task<WorkPermitDTO> UpdateImage(object obj, List<IFormFile> workerFiles);
        Task<WorkPermitDTO> SearchInitialize(JObject obj);
        Task<WorkPermitDTO> ChangeStatus(JObject obj);
        Task<WorkPermitDTO> FetchVendor(JObject obj);
        Task<WorkPermitDTO> OnChangeVendor(JObject obj);
        Task<WorkPermitDTO> FetchCheckPoints(JObject obj);
        Task<WorkPermitDTO> GetWpPass(JObject obj);
        Task<WorkPermitDTO> FilterWorkPermitCode(JObject obj);
        Task<WorkPermitDTO> CheckOut(JObject obj);
        Task<WorkPermitDTO> CheckIn(JObject obj);
    }
}
