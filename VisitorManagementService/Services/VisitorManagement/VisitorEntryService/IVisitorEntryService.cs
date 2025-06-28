using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Entities;

namespace VisitorManagementMySQL.Services.VisitorManagement.VisitorEntryService
{
    public interface IVisitorEntryService
    {
        Task<VisitorEntryDTO> FilterPreBookinNo(JObject obj);
        Task<VisitorEntryDTO> OnChangeVisitorType(JObject obj);
        Task<VisitorEntryDTO> OnChangeWorkPermit(JObject obj);
        Task<VisitorEntryDTO> OnChangePartyType(JObject obj);
        Task<VisitorEntryDTO> OnChangeVisitor(JObject obj);
        Task<VisitorEntryDTO> OnChangeVisHost(JObject obj);
        Task<VisitorEntryDTO> CreateInitialize(JObject obj);
        Task<VisitorEntryDTO> SearchInitialize(JObject obj);
        Task<VisitorEntryDTO> Create(object obj, IFormFile webfile, IFormFile webfile1, List<IFormFile> webfiles);
        Task<VisitorEntryDTO> Update(object obj, IFormFile webfile, IFormFile webfile1, List<IFormFile> webfiles);
        Task<VisitorEntryDTO> ChangeStatus(JObject obj);
        Task<VisitorEntryDTO> CheckOut(JObject obj);
        Task<VisitorEntryDTO> CheckIn(JObject obj);
        Task<VisitorEntryDTO> VehicleData(JObject obj);
        Task<VisitorEntryDTO> FilterVisitorEntryCodeManual(JObject obj);
        Task<VisitorEntryDTO> FilterVisitorEntryCode(JObject obj);
        Task<VisitorEntryDTO> OnChangeVisitorEntryCode(JObject obj);
        Task<VisitorEntryDTO> CheckinCkeckoutPageLoad(JObject obj);
        Task<VisitorEntryDTO> OnChangeEntryDetail(JObject obj);
        Task<VisitorEntryDTO> ShowPass(JObject obj);

    }
}