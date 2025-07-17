using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Services.Reports.RptCheckInCheckOutService
{
    public class RptCheckInCheckOutService : IRptCheckInCheckOutService
    {
        private readonly RptCheckInCheckOutDTO dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        private readonly IHttpContextAccessor httpContextAccessor;

        public RptCheckInCheckOutService(
            DbContextHelper _dbContextHelper,
            IHttpContextAccessor _httpContextAccessor,
            IDapperContext _dapperContext
        )
        {
            dto = new RptCheckInCheckOutDTO();
            DbContext = _dbContextHelper;
            httpContextAccessor = _httpContextAccessor;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }

        //  public async Task<Object> OnChangeVisitor(JObject obj)
        // {
        //     try
        //     {
        //         string VisitorTypeId = obj["VisitorTypeId"].ToObject<string>();
        //         string Type = "OnChangeVisitor";
        //         using (dapperContext)
        //         {
        //             var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_CHECKIN_CHECKOUT_RPT", new
        //             {
        //                 Type,
        //                 VisitorTypeId
        //             });
        //             dto.VisitorList = (await spcall.ReadAsync<VisitorEntry>()).ToList();
        //         }
        //         dto.transtatus.result = true;
        //     }
        //     catch (Exception ex)
        //     {
        //         dto.transtatus.result = false;
        //         dto.transtatus.lstErrorItem.Add(
        //             new ErrorItem
        //             {
        //                 ErrorNo = "VM0000",
        //                 Message = ex.Message
        //             }
        //         );
        //     }
        //     return dto;
        // }
        public async Task<object> SearchInitialize(JObject obj)
        {
            try
            {
                string Type = "SearchInitialize";

                DateTime? FromDate = obj["FromDate"]?.ToObject<DateTime?>();
                DateTime? ToDate = obj["ToDate"]?.ToObject<DateTime?>();

                // Default filters to null (which will be treated as "All" in stored procedure)
                string PlantIds = obj["PlantId"].ToString();
                string VisitorTypeId = obj["VisitorTypeId"].ToString();
                string PurposeOfVisit = obj["PurposeOfVisit"].ToString();

                long CompanyId = obj["CompanyId"]?.ToObject<long>() ?? 0;

                // URL schemes for images
                string Scheme = httpContextAccessor.HttpContext.Request.Scheme + "://" +
                                httpContextAccessor.HttpContext.Request.Host.Value + "/upload/VisitorEntry/";

                string SignScheme = httpContextAccessor.HttpContext.Request.Scheme + "://" +
                                    httpContextAccessor.HttpContext.Request.Host.Value + "/upload/VisitorDigSigns/";

                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_CHECKIN_CHECKOUT_RPT",
                        new
                        {
                            Type,
                            FromDate,
                            ToDate,
                            PlantIds,
                            VisitorTypeId,
                            PurposeOfVisit,
                            PlantId = (object)null,
                            RoleId = (object)null,
                            CompanyId,
                            Scheme,
                            SignScheme
                        }
                    );

                    dto.CheckinCheckoutList = (await spcall.ReadAsync<dynamic>()).ToList();
                }

                dto.transtatus.result = true;
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(new ErrorItem
                {
                    ErrorNo = "VM0000",
                    Message = ex.Message
                });
            }

            return dto;
        }


        public async Task<object> CreateInitialize(JObject obj)
        {
            try
            {
                long VisitorTypeId = obj["VisitorTypeId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "CreateInitialize";
                string Scheme =
                    httpContextAccessor.HttpContext.Request.Scheme
                    + "://"
                    + httpContextAccessor.HttpContext.Request.Host.Value.ToString()
                    + "/upload/VisitorEntry/";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_CHECKIN_CHECKOUT_RPT",
                        new
                        {
                            Type,
                            FromDate = (object)null,
                            ToDate = (object)null,
                            PlantId,
                            PlantIds = (object)null,
                            RoleId,
                            CompanyId,
                            VisitorTypeId,
                            PurposeOfVisit = (object)null,
                            Scheme,
                            SignScheme = (object)null
                        }
                    );

                    dto.VisitorTypeList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.PovList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.PlantList = (await spcall.ReadAsync<Plant>()).ToList();
                    if (VisitorTypeId > 0)
                    {
                        dto.HdrTable = (await spcall.ReadAsync<VisitorEntry>()).SingleOrDefault();
                    }
                }
                dto.transtatus.result = true;
            }
            catch (Exception ex)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }

            return dto;
        }
    }
}
