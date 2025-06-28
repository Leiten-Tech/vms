using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Entities;

namespace VisitorManagementMySQL.Services.Master.ExternalBookVisitorService
{
    public interface IExternalBookVisitorService
    {
        Task<VisitorDTO> CreateInitialize(JObject obj);
        Task<VisitorDTO> SearchInitialize(JObject obj);
        Task<VisitorDTO> Create(object obj, IFormFile webfile, IFormFile webfile1, List<IFormFile> webfiles);
        Task<VisitorDTO> Update(object obj, IFormFile webfile, IFormFile webfile1, List<IFormFile> webfiles);
        Task<VisitorDTO> ChangeStatus(JObject obj);
        Task<VisitorDTO> OnChangeCountry(JObject obj);
        Task<VisitorDTO> OnChangeState(JObject obj);
    }
}