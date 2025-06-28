using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Services.Master.SupplierService
{
    public class SupplierService : ISupplierService
    {
        private readonly SupplierDTO dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;

        public SupplierService(DbContextHelper _dbContextHelper, IDapperContext _dapperContext)
        {
            dto = new SupplierDTO();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.tranStatus = new ErrorContext();
            dto.tranStatus.lstErrorItem = new List<ErrorItem>();
        }

        public async Task<Object> OnChangeCountry(JObject obj)
        {
            try
            {
                long CountryId = obj["CountryId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "OnChangeCountry";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_SUPPLIER_CI",
                        new
                        {
                            Type,
                            SupplierId = (Object)null,
                            CountryId,
                            StateId = (Object)null,
                            Scheme = (Object)null,
                            CompanyId,
                            RoleId,
                            PlantId,
                        }
                    );
                    dto.StateList = (await spcall.ReadAsync<State>()).ToList();
                }
                dto.tranStatus.result = true;
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<Object> OnChangeState(JObject obj)
        {
            try
            {
                long StateId = obj["StateId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "OnChangeState";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_SUPPLIER_CI",
                        new
                        {
                            Type,
                            SupplierId = (Object)null,
                            CountryId = (Object)null,
                            StateId,
                            Scheme = (Object)null,
                            CompanyId,
                            RoleId,
                            PlantId,
                        }
                    );
                    dto.CityList = (await spcall.ReadAsync<City>()).ToList();
                }
                dto.tranStatus.result = true;
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<object> ChangeStatus(JObject obj)
        {
            long SupplierId = obj["SupplierId"].ToObject<long>();

            try
            {
                //long SupplierId = obj["SupplierId"].ToObject<long>();
                var isexistveh = DbContext
                    .Vehicles.Where(x => x.SupplierId == SupplierId && x.Status == 1)
                    .ToList();
                if (isexistveh.Count > 0)
                {
                    dto.tranStatus.result = false;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            Message =
                                "Inactive not allowed. This Supplier is linked to active Vehicles.",
                        }
                    );
                    return dto;
                }
                Supplier Supplier = DbContext
                    .Suppliers.Where((s) => s.SupplierId == SupplierId)
                    .SingleOrDefault();
                Supplier.Status = 2;
                DbContext.Suppliers.Update(Supplier);
                await DbContext.SaveChangesAsync();
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { Message = "Status Changed Successfully" }
                );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<object> Create(JObject obj)
        {
            try
            {
                Supplier Supplier = obj["Supplier"].ToObject<Supplier>();
                // Supplier.SupplierBillingDetails = obj["SupplierDetail"].ToObject<List<SupplierBillingDetail>>();
                var SupplierGstNo = DbContext
                    .Suppliers.Where(e => e.SupplierGstNo == Supplier.SupplierGstNo)
                    .ToList();
                var SupplierMailId = DbContext
                    .Suppliers.Where(e => e.SupplierMailId == Supplier.SupplierMailId)
                    .ToList();
                var SupplierMobileNo = DbContext
                    .Suppliers.Where(e => e.SupplierMobileNo == Supplier.SupplierMobileNo)
                    .ToList(); //new
                var SupplierMobileNo2 = DbContext
                    .Suppliers.Where(e => e.SupplierMobileNo2 == Supplier.SupplierMobileNo2)
                    .ToList(); //new
                Supplier.SupplierCode = await GenerateUniqueCode();
                // Supplier.SupplierCode = "SUP0003";
                string PhoneNumber = Supplier.SupplierMobileNo;
                string secPhoneNumber = Supplier.SupplierMobileNo2;
                string SupplierName = Supplier.SupplierName;
                string SupplierMailID = Supplier.SupplierMailId;
                string SupplierGSTNo = Supplier.SupplierGstNo;
                var mailId = Supplier.SupplierMailId;
                var Suppliers = DbContext
                    .Suppliers.Where(y => y.SupplierName == Supplier.SupplierName)
                    .SingleOrDefault();
                string GstSuppName = "";
                string EmailSuppName = "";
                string ConcSuppName = ""; //new
                string SecConcSuppName = ""; //new
                if (SupplierGstNo.Count > 0)
                {
                    GstSuppName = String.Join(",", SupplierGstNo.Select(x => x.SupplierName));
                }
                if (SupplierMailId.Count > 0)
                {
                    EmailSuppName = String.Join(",", SupplierMailId.Select(x => x.SupplierName));
                }
                if (SupplierMobileNo.Count > 0) //new
                {
                    ConcSuppName = String.Join(",", SupplierMobileNo.Select(x => x.SupplierName));
                }
                if (SupplierMobileNo2.Count > 0) //new
                {
                    SecConcSuppName = String.Join(
                        ",",
                        SupplierMobileNo2.Select(x => x.SupplierName)
                    );
                }
                if (Suppliers != null)
                {
                    dto.tranStatus.result = false;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            Message = $"Supplier Name :{Suppliers.SupplierName}  already exists. ",
                        }
                    );
                    return dto;
                }
                if (
                    SupplierMobileNo != null
                    && SupplierMobileNo.Any(s => !string.IsNullOrEmpty(s.SupplierMobileNo))
                    && !string.IsNullOrEmpty(Supplier.SupplierMobileNo)
                ) //new
                {
                    dto.tranStatus.result = false;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                "Supplier Contact No: \""
                                + PhoneNumber
                                + "\" is already exists for Supplier Name \""
                                + ConcSuppName
                                + "\"",
                        }
                    );
                    return dto;
                }
                if (
                    SupplierMobileNo2 != null
                    && SupplierMobileNo2.Any(s => !string.IsNullOrEmpty(s.SupplierMobileNo2))
                    && !string.IsNullOrEmpty(Supplier.SupplierMobileNo2)
                )
                {
                    if (SupplierMobileNo2 != null && SupplierMobileNo2.Count > 0) //new
                    {
                        dto.tranStatus.result = false;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                ErrorNo = "VMS000",
                                Message =
                                    "Supplier Secondary Contact No: \""
                                    + secPhoneNumber
                                    + "\" is already exists for Supplier Name \""
                                    + SecConcSuppName
                                    + "\"",
                            }
                        );
                        return dto;
                    }
                }

                if (PhoneNumber == secPhoneNumber)
                {
                    dto.tranStatus.result = false;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                "Contact Number & Secondary Contact Number should not be same values.",
                        }
                    );
                    return dto;
                }

                if (SupplierMailId.Count > 0)
                {
                    dto.tranStatus.result = false;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                "Email ID: \""
                                + mailId
                                + "\" is already exists for Supplier Name \""
                                + EmailSuppName
                                + "\"",
                        }
                    );
                    return dto;
                }

                if (
                    SupplierGstNo != null
                    && SupplierGstNo.Any(s => !string.IsNullOrEmpty(s.SupplierGstNo))
                )
                {
                    dto.tranStatus.result = false;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                "Supplier GST No: \""
                                + SupplierGSTNo
                                + "\" is already exists for Supplier Name \""
                                + GstSuppName
                                + "\"",
                        }
                    );
                    return dto;
                }
                if (!string.IsNullOrEmpty(Supplier.SupplierPanNo))
                {
                    var Supplierpanno = DbContext
                        .Suppliers.Where(p => p.SupplierPanNo == Supplier.SupplierPanNo)
                        .SingleOrDefault();
                    if (Supplierpanno != null)
                    {
                        dto.tranStatus.result = false;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                Message =
                                    $"Supplier Pan No :{Supplierpanno.SupplierPanNo}  already exists. ",
                            }
                        );
                        return dto;
                    }
                }
                if (dto.tranStatus.lstErrorItem.Count == 0)
                {
                    DbContext.Suppliers.Add(Supplier);
                    await DbContext.SaveChangesAsync();
                    dto.tranStatus.result = true;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem { Message = "Created Successfully" }
                    );
                }
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }

            return dto;
        }

        public async Task<object> CreateInitialize(JObject obj)
        {
            try
            {
                long SupplierId = obj["SupplierId"].ToObject<long>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "CreateInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_SUPPLIER_CI",
                        new
                        {
                            Type,
                            SupplierId,
                            CountryId = (Object)null,
                            StateId = (Object)null,
                            Scheme = (Object)null,
                            CompanyId,
                            RoleId,
                            PlantId,
                        }
                    );

                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.CategoryList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.SupplierTypeList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.CountryList = (await spcall.ReadAsync<Country>()).ToList();
                    if (SupplierId > 0)
                    {
                        dto.StateList = (await spcall.ReadAsync<State>()).ToList();
                        dto.CityList = (await spcall.ReadAsync<City>()).ToList();
                        dto.HdrTable = (await spcall.ReadAsync<Supplier>()).SingleOrDefault();
                        // dto.DtlTable = (await spcall.ReadAsync<SupplierBillingDetail>()).ToList();
                    }
                }
                dto.tranStatus.result = true;
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<object> Update(JObject obj)
        {
            try
            {
                Supplier Supplier = obj["Supplier"].ToObject<Supplier>();
                long SupplierId = Supplier.SupplierId;
                string PhoneNumber = Supplier.SupplierMobileNo;
                string secPhoneNumber = Supplier.SupplierMobileNo2;
                string SupplierMailID = Supplier.SupplierMailId; //new
                string SupplierGSTNo = Supplier.SupplierGstNo; //new
                // Supplier.SupplierBillingDetails = obj["SupplierDetail"].ToObject<List<SupplierBillingDetail>>();
                var isexistveh = DbContext
                    .Vehicles.Where(x => x.SupplierId == SupplierId && x.Status == 1)
                    .ToList();
                var SupplierGstNo = DbContext
                    .Suppliers.Where(p =>
                        p.SupplierGstNo == Supplier.SupplierGstNo
                        && p.SupplierId != Supplier.SupplierId
                    )
                    .ToList(); //new
                var Supplieremail = DbContext
                    .Suppliers.Where(p =>
                        p.SupplierMailId == Supplier.SupplierMailId
                        && p.SupplierId != Supplier.SupplierId
                    )
                    .ToList(); //new
                var Suppliermobno = DbContext
                    .Suppliers.Where(p =>
                        p.SupplierMobileNo == Supplier.SupplierMobileNo
                        && p.SupplierId != Supplier.SupplierId
                    )
                    .ToList(); //new
                var SecSuppliermobno = DbContext
                    .Suppliers.Where(p =>
                        p.SupplierMobileNo2 == Supplier.SupplierMobileNo2
                        && p.SupplierId != Supplier.SupplierId
                    )
                    .ToList(); //new
                var Suppliers = DbContext
                    .Suppliers.Where(y =>
                        y.SupplierId != Supplier.SupplierId
                        && y.SupplierName == Supplier.SupplierName
                    )
                    .SingleOrDefault();
                string GstSuppName = ""; //new
                string EmailSuppName = ""; //new
                string ConcSuppName = ""; //new
                string SecConcSuppName = ""; //new
                if (SupplierGstNo.Count > 0)
                {
                    GstSuppName = String.Join(",", SupplierGstNo.Select(x => x.SupplierName));
                }
                if (Supplieremail.Count > 0)
                {
                    EmailSuppName = String.Join(",", Supplieremail.Select(x => x.SupplierName));
                }
                if (Suppliermobno.Count > 0) //new
                {
                    ConcSuppName = String.Join(",", Suppliermobno.Select(x => x.SupplierName));
                }
                if (SecSuppliermobno.Count > 0) //new
                {
                    SecConcSuppName = String.Join(
                        ",",
                        SecSuppliermobno.Select(x => x.SupplierName)
                    );
                }

                // if (Supplier.SupplierBillingDetails.Count > 0)
                // {
                //     var SBD = DbContext.SupplierBillingDetails.Where(x => x.SupplierId == Supplier.SupplierId).ToList();
                //     DbContext.SupplierBillingDetails.RemoveRange(SBD);
                // }
                if (Suppliers != null)
                {
                    dto.tranStatus.result = false;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            Message = $"Supplier Name :{Suppliers.SupplierName}  already exists. ",
                        }
                    );
                    return dto;
                }
                if (!string.IsNullOrEmpty(Supplier.SupplierMobileNo))
                {
                    if (Suppliermobno != null && Suppliermobno.Count > 0) //new
                    {
                        dto.tranStatus.result = false;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                ErrorNo = "VMS000",
                                Message =
                                    "Supplier Contact No: \""
                                    + PhoneNumber
                                    + "\" is already exists for Supplier Name \""
                                    + ConcSuppName
                                    + "\"",
                            }
                        );
                        return dto;
                    }
                }
                if (!string.IsNullOrEmpty(Supplier.SupplierMobileNo2))
                {
                    if (SecSuppliermobno != null && SecSuppliermobno.Count > 0) //new
                    {
                        dto.tranStatus.result = false;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                ErrorNo = "VMS000",
                                Message =
                                    "Supplier Secondary Contact No: \""
                                    + secPhoneNumber
                                    + "\" is already exists for Supplier Name \""
                                    + SecConcSuppName
                                    + "\"",
                            }
                        );
                        return dto;
                    }
                }

                if (PhoneNumber == secPhoneNumber)
                {
                    dto.tranStatus.result = false;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                "Contact Number & Secondary Contact Number should not be same values.",
                        }
                    );
                    return dto;
                }
                if (Supplieremail.Count > 0)
                {
                    dto.tranStatus.result = false;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                "Email ID: \""
                                + SupplierMailID
                                + "\" is already exists for Supplier Name \""
                                + EmailSuppName
                                + "\"",
                        }
                    );
                    return dto;
                }

                if (
                    SupplierGstNo != null
                    && SupplierGstNo.Any(s => !string.IsNullOrEmpty(s.SupplierGstNo))
                )
                {
                    dto.tranStatus.result = false;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                "Supplier GST No: \""
                                + SupplierGSTNo
                                + "\" is already exists for Supplier Name \""
                                + GstSuppName
                                + "\"",
                        }
                    );
                    return dto;
                }

                if (Supplier.Status != 1)
                {
                    if (isexistveh.Count > 0)
                    {
                        dto.tranStatus.result = false;
                        dto.tranStatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                Message =
                                    "Inactive not allowed. This Supplier is linked to active Vehicles.",
                            }
                        );
                        return dto;
                    }
                }
                if (dto.tranStatus.lstErrorItem.Count == 0)
                {
                    DbContext.Suppliers.Update(Supplier);
                    await DbContext.SaveChangesAsync();
                    dto.tranStatus.result = true;
                    dto.tranStatus.lstErrorItem.Add(
                        new ErrorItem { Message = "Updated Successfully" }
                    );
                }
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }
            return dto;
        }

        public async Task<object> SearchInitialize(JObject obj)
        {
            try
            {
                long SupplierId = obj["SupplierId"].ToObject<long>();
                string Type = "SearchInitialize";
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();

                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_SUPPLIER_CI",
                        new
                        {
                            Type,
                            SupplierId,
                            CountryId = (Object)null,
                            StateId = (Object)null,
                            Scheme = (Object)null,
                            CompanyId,
                            RoleId,
                            PlantId,
                        }
                    );

                    dto.SupplierList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.tranStatus.result = true;
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
                );
            }

            return dto;
        }

        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "11";
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
    }
}
