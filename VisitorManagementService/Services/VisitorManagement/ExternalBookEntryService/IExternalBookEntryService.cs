using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Entities;

namespace VisitorManagementMySQL.Services.VisitorManagement.ExternalBookEntryService
{
    public interface IExternalBookEntryService
    {
        Task<VisitorEntryDTO> CreateInitialize(JObject obj);
        Task<VisitorEntryDTO> OnEnterMobileNo(JObject obj);
        Task<VisitorEntryDTO> OnChangePartyType(JObject obj);
        Task<VisitorEntryDTO> OnChangeVisitorType(JObject obj);
        Task<VisitorEntryDTO> OnChangeVisitor(JObject obj);
        Task<VisitorEntryDTO> OnChangeVehicle(JObject obj);
        Task<VisitorEntryDTO> FilterVehicleNo(JObject obj);
        Task<VisitorEntryDTO> FilterDriver(JObject obj);
        Task<VisitorEntryDTO> FilterPreBookinNo(JObject obj);
        Task<VisitorEntryDTO> Create(
            object obj,
            IFormFile webfile,
            IFormFile webfile1,
            IFormFile digSign,
            List<IFormFile> webfiles
        );
        Task<VisitorEntryDTO> ChangeStatus(JObject obj);
        Task<VisitorEntryDTO> SearchInitialize(JObject obj);
        Task<VisitorEntryDTO> Update(
            object obj,
            IFormFile webfile,
            IFormFile webfile1,
            IFormFile digSign,
            List<IFormFile> webfiles
        );
        Task<VisitorEntryDTO> UpdateImage(
            JObject obj,
            IFormFile webfile,
            IFormFile webfile1,
            List<IFormFile> webfiles
        );
        Task<VisitorEntryDTO> CheckinCkeckoutPageLoad(JObject obj);
        Task<VisitorEntryDTO> CheckIn(JObject obj);
        Task<VisitorEntryDTO> CheckOut(JObject obj);
        Task<VisitorEntryDTO> FilterVisitorEntryCode(JObject obj);
        Task<VisitorEntryDTO> OnChangeVisitorEntryCode(JObject obj);
        Task<VisitorEntryDTO> OnChangeVehicleNo(JObject obj);
        Task<VisitorEntryDTO> OnChangeExistVehicleNo(JObject obj);
        Task<string> GenerateMailToken(
            string tokenType,
            string encryptedToken,
            string ApprovalType,
            string ApprovalText
        );
        Task<VisitorEntryDTO> OnChangePlant(JObject obj);
        Task<VisitorEntryDTO> OnChangeDepartment(JObject obj);
    }
}
