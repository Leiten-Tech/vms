using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Services.Common;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Services.Master.VisitorService
{
    public class VisitorService : IVisitorService
    {
        private readonly DbContextHelper dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IDapperContext dapperContext;
        private readonly ICommonService commonService;
        private VisitorDTO dto;
        private readonly FileUploadService.FileUploadService uploadService;

        public VisitorService(
            DbContextHelper _dbContext,
            IHttpContextAccessor _httpContextAccessor,
            IDapperContext _dapperContext,
            FileUploadService.FileUploadService _uploadService,
            ICommonService _commonService
        )
        {
            dbContext = _dbContext;
            httpContextAccessor = _httpContextAccessor;
            dapperContext = _dapperContext;
            commonService = _commonService;
            uploadService = _uploadService;
            dto = new VisitorDTO();
            dto.tranStatus = new ErrorContext();
            dto.tranStatus.result = false;
            dto.tranStatus.lstErrorItem = new List<ErrorItem>();
        }

        public async Task<VisitorDTO> ChangeStatus(JObject obj)
        {
            try
            {
                long VisitorId = obj["VisitorId"].ToObject<long>();
                var visitor = dbContext
                    .Visitors.Where(x => x.VisitorId == VisitorId)
                    .SingleOrDefault();
                visitor.Status = 2;
                dbContext.Visitors.Update(visitor);
                dbContext.SaveChanges();
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "Status Changed Successfully." }
                );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorDTO> Create(
            object obj,
            IFormFile webfile,
            IFormFile webfile1,
            List<IFormFile> webfiles
        )
        {
            try
            {
                Newtonsoft.Json.Linq.JObject _EmployeeJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();
                Visitor visitor = (Visitor)
                    serializer.Deserialize(
                        new JTokenReader(_EmployeeJSON["Visitor"]),
                        typeof(Visitor)
                    );
                visitor.VisitorDetails =
                    (List<VisitorDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_EmployeeJSON["VisitorDetail"]),
                            typeof(List<VisitorDetail>)
                        );

                // var MailId = dbContext.Visitors.Where(p => p.MailId == visitor.MailId && p.Status == 1).Select(x => x.FirstName + " " + x.LastName).ToList();
                // if (MailId.Count > 0)
                // {
                //     string visName = string.Join(",", MailId);
                //     dto.tranStatus.result = false;
                //     dto.tranStatus.lstErrorItem.Add(new ErrorItem
                //     {
                //         ErrorNo = "VMS000",
                //         Message = "Mail ID is already exists for " + visName + "."
                //     });
                //     return dto;
                // }
                // var PhoneNumber = dbContext.Visitors.Where(p => p.MobileNo == visitor.MobileNo && p.Status == 1).Select(x => x.FirstName + " " + x.LastName).ToList();
                // if (PhoneNumber.Count > 0)
                // {
                //     string visName = string.Join(",", PhoneNumber);
                //     dto.tranStatus.result = false;
                //     dto.tranStatus.lstErrorItem.Add(new ErrorItem
                //     {
                //         ErrorNo = "VMS000",
                //         Message = "Mobile No is already exists for " + visName + "."
                //     });
                //     return dto;
                // }
                string type = "CheckVisitorExists";
                List<string> MobileNos = new List<string>();
                foreach (var entry in visitor.VisitorDetails)
                {
                    MobileNos.Add(entry.MobileNo);
                }
                string MobileNosl = string.Join(", ", MobileNos);

                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_CI",
                        new
                        {
                            type,
                            VisitorId = (object)null,
                            MobileNosl,
                            Scheme = (object)null,
                            Scheme1 = (object)null,
                            Schemevisitordetail = (object)null,
                            SearchType = (object)null,
                            CountryId = (object)null,
                            StateId = (object)null,
                        }
                    );
                    dto.MobileExists = (await spcall.ReadAsync<dynamic>()).ToList();

                    if (dto.MobileExists != null && dto.MobileExists.Count > 0)
                    {
                        var mobileNumbers = dto
                            .MobileExists.Select(x => (string)((dynamic)x).MobileNo)
                            .ToList();
                        string MobNo = string.Join(", ", mobileNumbers);
                        dto.tranStatus.result = false;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                ErrorNo = "VMS000",
                                Message =
                                    $"Mobile No(s): {MobNo} have not been checked out. Please check out the visitor(s) with the same mobile number(s).",
                            }
                        );
                        return dto;
                    }
                }

                var blackListedVisitor = false;
                var blackListVisitorAlreadyExists = dbContext
                    .Visitors.Where(x => x.Status == 2)
                    .ToList();

                Visitor blackListedVisitors = new Visitor();

                if (blackListVisitorAlreadyExists.Count > 0)
                {
                    foreach (var item in blackListVisitorAlreadyExists)
                    {
                        if (
                            item.MobileNo == visitor.MobileNo
                            || (
                                !string.IsNullOrEmpty(visitor.MailId)
                                && item.MailId == visitor.MailId
                            )
                        )
                        {
                            blackListedVisitor = true;
                            blackListedVisitors = item;
                        }
                        else
                        {
                            blackListedVisitor = false;
                            blackListedVisitors = item;
                        }
                    }
                }

                if (blackListedVisitor)
                {
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message = "Mobile No or Mail Id is assigned to a Blacklisted Visitor.",
                        }
                    );
                }
                else
                {
                    var resturnstring = uploadService.UploadFile(webfile, "Visitor");
                    var resturnstring1 = uploadService.UploadFile(webfile1, "Visitordoc");
                    var resturnstrings = uploadService.UploadFiles(webfiles, "VisitorDetail");
                    // foreach (var visitorDetail in visitor.VisitorDetails)
                    // {
                    //     visitorDetail.VisitorDetailCode = await GenerateUniqueCode();
                    // }


                    Visitor visitorExists = dbContext
                        .Visitors.Where(p => (p.MobileNo == visitor.MobileNo) && p.Status == 1)
                        .FirstOrDefault();
                    if (visitorExists != null)
                    {
                        visitorExists.VisitorDetails = dbContext
                            .VisitorDetails.Where(p =>
                                p.VisitorId == visitorExists.VisitorId
                                && (p.MobileNo == visitor.MobileNo)
                            )
                            .ToList();
                        visitorExists.MailId = visitor.MailId;
                        visitorExists.MobileNo = visitor.MobileNo;
                        visitorExists.FirstName = visitor.FirstName;
                        visitorExists.LastName = visitor.LastName;
                        visitorExists.VisitorTypeId = visitor.VisitorTypeId;
                        visitorExists.CompanyId = visitor.CompanyId;
                        visitorExists.PlantId = visitor.PlantId;
                        foreach (var item in visitorExists.VisitorDetails)
                        {
                            item.FirstName = visitor.FirstName;
                            item.LastName = visitor.LastName;
                            item.MailId = visitor.MailId;
                            item.MobileNo = visitor.MobileNo;
                        }

                        dbContext.Visitors.Update(visitorExists);
                        dbContext.SaveChanges();
                        commonService.VisitorLogSave(visitorExists, dbContext);

                        Visitor VisitorUpdated = dbContext
                            .Visitors.Where(p => p.VisitorId == visitorExists.VisitorId)
                            .SingleOrDefault();
                        VisitorUpdated.VisitorDetails = dbContext
                            .VisitorDetails.Where(p => p.VisitorId == visitorExists.VisitorId)
                            .ToList();
                        dto.VisitorHeader = VisitorUpdated;
                    }
                    else
                    {
                        var code = 0;
                        var detailCode = "";
                        foreach (var visitorDetail in visitor.VisitorDetails)
                        {
                            if (code == 0)
                            {
                                visitorDetail.VisitorDetailCode = await GenerateUniqueCode();
                                code = 1;
                                detailCode = visitorDetail.VisitorDetailCode;
                            }
                            else if (code == 1)
                            {
                                visitorDetail.VisitorDetailCode = await generateCode(detailCode);
                                detailCode = visitorDetail.VisitorDetailCode;
                            }
                        }
                        dbContext.Visitors.Add(visitor);
                        dbContext.SaveChanges();
                        commonService.VisitorLogSave(visitor, dbContext);

                        dto.VisitorHeader = visitor;
                    }
                    dto.tranStatus.result = true;
                    dto.VisitorList = dbContext
                        .Visitors.Where(v => v.CompanyId == visitor.CompanyId)
                        .ToList();
                    // dto.VisitorList.ForEach(x => x.VisitorDetails = dbContext.VisitorDetails.ToList());

                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem { ErrorNo = "VMS000", Message = "Created Successfully." }
                    );
                }
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<string> generateCode(string detailCode)
        {
            // string documentno = "";
            int numericPart = int.Parse(detailCode.Substring(3));
            numericPart++;
            string documentno = "VST" + numericPart.ToString("D5");
            return documentno;
        }

        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "26";
            string series = "45";
            using (dapperContext)
            {
                var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                    spName: "GetPrimaryKey",
                    new { documentid, series }
                );
                documentno = (await spcall.ReadAsync<string>()).SingleOrDefault();
            }
            return documentno;
        }

        public async Task<VisitorDTO> CreateInitialize(JObject obj)
        {
            try
            {
                long VisitorId = obj["VisitorId"].ToObject<long>();
                string Scheme =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/Visitor/";
                string Scheme1 =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/Visitordoc/";
                string Schemevisitordetail =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorDetail/";
                string type = "CreateInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_CI",
                        new
                        {
                            type,
                            VisitorId,
                            Scheme,
                            Scheme1,
                            Schemevisitordetail,
                            MobileNosl = (object)null,
                            SearchType = (object)null,
                            CountryId = (object)null,
                            StateId = (object)null,
                        }
                    );
                    dto.VisitorTypeList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.TitleList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.IdCardList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.WorkSeverityList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.CountryList = (await spcall.ReadAsync<Country>()).ToList();
                    dto.DepartmentList = (await spcall.ReadAsync<Department>()).ToList();
                    if (VisitorId > 0)
                    {
                        dto.StateList = (await spcall.ReadAsync<State>()).ToList();
                        dto.CityList = (await spcall.ReadAsync<City>()).ToList();
                        dto.VisitorHeader = (await spcall.ReadAsync<Visitor>()).SingleOrDefault();
                        dto.VisitorDetail = (await spcall.ReadAsync<VisitorDetail>()).ToList();
                    }
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorDTO> OnChangeCountry(JObject obj)
        {
            try
            {
                long CountryId = obj["CountryId"].ToObject<long>();
                string type = "OnChangeCountry";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_CI",
                        new
                        {
                            type,
                            CountryId,
                            MobileNosl = (object)null,
                            SearchType = (object)null,
                            VisitorId = (object)null,
                            StateId = (object)null,
                            Scheme = (object)null,
                            Scheme1 = (object)null,
                            Schemevisitordetail = (object)null,
                        }
                    );
                    dto.StateList = (await spcall.ReadAsync<State>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorDTO> OnChangeState(JObject obj)
        {
            try
            {
                long StateId = obj["StateId"].ToObject<long>();
                string type = "OnChangeState";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_CI",
                        new
                        {
                            type,
                            StateId,
                            MobileNosl = (object)null,
                            SearchType = (object)null,
                            VisitorId = (object)null,
                            CountryId = (object)null,
                            Scheme = (object)null,
                            Scheme1 = (object)null,
                            Schemevisitordetail = (object)null,
                        }
                    );
                    dto.CityList = (await spcall.ReadAsync<City>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorDTO> SearchInitialize(JObject obj)
        {
            try
            {
                string Scheme =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/Visitor/";
                string type = "SearchInitialize";
                string SearchType = obj["SearchType"].ToObject<string>();
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_VISITOR_CI",
                        new
                        {
                            type,
                            Scheme,
                            SearchType,
                            MobileNosl = (object)null,
                            VisitorId = (object)null,
                            CountryId = (object)null,
                            StateId = (object)null,
                            Scheme1 = (object)null,
                            Schemevisitordetail = (object)null,
                        }
                    );
                    dto.VisitorTypeSearchList = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.VisitorSearchList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(new ErrorItem { ErrorNo = "VMS000", Message = "" });
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<VisitorDTO> Update(
            object obj,
            IFormFile webfile,
            IFormFile webfile1,
            List<IFormFile> webfiles
        )
        {
            try
            {
                Newtonsoft.Json.Linq.JObject _EmployeeJSON = (Newtonsoft.Json.Linq.JObject)obj;
                Newtonsoft.Json.JsonSerializer serializer = new Newtonsoft.Json.JsonSerializer();
                Visitor visitor = (Visitor)
                    serializer.Deserialize(
                        new JTokenReader(_EmployeeJSON["Visitor"]),
                        typeof(Visitor)
                    );
                visitor.VisitorDetails =
                    (List<VisitorDetail>)
                        serializer.Deserialize(
                            new JTokenReader(_EmployeeJSON["VisitorDetail"]),
                            typeof(List<VisitorDetail>)
                        );
                var resturnstring = uploadService.UploadFile(webfile, "Visitor");
                var resturnstring1 = uploadService.UploadFile(webfile1, "Visitordoc");
                var resturnstrings = uploadService.UploadFiles(webfiles, "VisitorDetail");
                dbContext.Visitors.Update(visitor);
                dbContext.SaveChanges();

                dto.VisitorHeader = visitor;
                dto.VisitorList = dbContext
                    .Visitors.Where(v => v.CompanyId == visitor.CompanyId)
                    .ToList();

                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = "Updated Successfully." }
                );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VMS000", Message = ex.Message }
                );
            }
            return dto;
        }
    }
}
