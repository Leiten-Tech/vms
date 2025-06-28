using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;
using System.Text.RegularExpressions;

namespace VisitorManagementMySQL.Services.Master.Branch
{
    public class BranchService //: IBranchService
    {
        private readonly BranchDTO dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;

        public BranchService()
        {
        }

        // public BranchService(DbContextHelper _dbContextHelper, IDapperContext _dapperContext)
        // {
        //     dto = new BranchDTO();
        //     DbContext = _dbContextHelper;
        //     dapperContext = _dapperContext;
        //     dto.transtatus = new ErrorContext();
        //     dto.transtatus.lstErrorItem = new List<ErrorItem>();
        // }

        // public async Task<object> CreateInitialize(JObject obj)
        // {
        //     int Branchid = obj["Branchid"].ToObject<int>();
        //     string Type = "CreateInitialize";
        //     try
        //     {
        //         using (dapperContext)
        //         {
        //             var spcall = await dapperContext.ExecuteStoredProcedureAsync(
        //                 spName: "SP_BRANCH_CI",
        //                 new { Type, Branchid }
        //             );

        //             dto.BranchList = (await spcall.ReadAsync<BranchMaster>()).ToList();
        //             if (Branchid > 0)
        //             {
        //                 dto.HdrTable = (await spcall.ReadAsync<BranchMaster>()).SingleOrDefault();
        //             }
        //         }
        //         dto.transtatus.result = true;
        //         dto.transtatus.lstErrorItem.Add(
        //             new ErrorItem { Message = "CreateInitialize Successfully" }
        //         );
        //     }
        //     catch (Exception ex)
        //     {
        //         dto.transtatus.result = false;
        //         dto.transtatus.lstErrorItem.Add(
        //             new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
        //         );
        //     }

        //     return dto;
        // }

        // public async Task<object> Create(JObject obj)
        // {
        //     BranchMaster BranchMaster = obj["BranchMaster"].ToObject<BranchMaster>();
        //     try
        //     {
        //         // await ValidateBranchforCreateAsync(obj);

        //         // DbContext..Add(BranchMaster);
        //         // await DbContext.SaveChangesAsync();

        //         // dto.transtatus.result = true;
        //         // dto.transtatus.lstErrorItem.Add(new ErrorItem { Message = "Create Successfully" });
        //     }
        //     catch (Exception ex)
        //     {
        //         dto.transtatus.result = false;
        //         dto.transtatus.lstErrorItem.Add(
        //             new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
        //         );
        //     }

        //     return dto;
        // }

        // public async Task<object> Update(JObject obj)
        // {
        //     try
        //     {
        //         // await ValidateBranchforCreateAsync(obj);
        //         // BranchMaster BranchMaster = obj["BranchMaster"].ToObject<BranchMaster>();
        //         // DbContext.BranchMasters.Update(BranchMaster);
        //         // await DbContext.SaveChangesAsync();
        //         // dto.transtatus.result = true;
        //         // dto.transtatus.lstErrorItem.Add(new ErrorItem { Message = "Updated Successfully" });
        //     }
        //     catch (Exception ex)
        //     {
        //         dto.transtatus.result = false;
        //         dto.transtatus.lstErrorItem.Add(
        //             new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
        //         );
        //     }
        //     return dto;
        // }

        // public async Task<object> ChangeStatus(JObject obj)
        // {
        //     int Branchid = obj["Branchid"].ToObject<int>();
        //     try
        //     {
        //         // BranchMaster BranchMaster = DbContext.BranchMasters
        //         //     .Where(y => y.Branchid == Branchid)
        //         //     .SingleOrDefault();
        //         // BranchMaster.Status = 2;
        //         // DbContext.BranchMasters.Update(BranchMaster);
        //         // await DbContext.SaveChangesAsync();
        //         // dto.transtatus.result = true;
        //         // dto.transtatus.lstErrorItem.Add(
        //         //     new ErrorItem { Message = "Status Change Successfully" }
        //         // );
        //     }
        //     catch (Exception ex)
        //     {
        //         dto.transtatus.result = false;
        //         dto.transtatus.lstErrorItem.Add(
        //             new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
        //         );
        //     }
        //     return dto;
        // }

        // public async Task<object> SearchInitialize(JObject obj)
        // {
        //     int Branchid = obj["Branchid"].ToObject<int>();
        //     string Type = "SearchInitialize";
        //     try
        //     {
        //         using (dapperContext)
        //         {
        //             var spcall = await dapperContext.ExecuteStoredProcedureAsync(
        //                 spName: "SP_BRANCH_CI",
        //                 new { Type, Branchid }
        //             );

        //             dto.BranchList = (await spcall.ReadAsync<BranchMaster>()).ToList();
        //         }
        //         dto.transtatus.result = true;
        //         dto.transtatus.lstErrorItem.Add(
        //             new ErrorItem { Message = "SearchInitialize Successfully" }
        //         );
        //     }
        //     catch (Exception ex)
        //     {
        //         dto.transtatus.result = false;
        //         dto.transtatus.lstErrorItem.Add(
        //             new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
        //         );
        //     }

        //     return dto;
        // }

        // public async Task ValidateBranchforCreateAsync(JObject obj)
        // {
        //     // BranchMaster BranchMaster = obj["BranchMaster"].ToObject<BranchMaster>();
        //     // var existingBranchWithSameGST = DbContext.BranchMasters
        //     //     .Where(b => b.Gstno == BranchMaster.Gstno && b.Branchid != BranchMaster.Branchid)
        //     //     .FirstOrDefault();
        //     // string Branchcode = BranchMaster.Branchcode;
        //     // string Branchname = BranchMaster.Branchname;
        //     // string Status = BranchMaster.Status != 2 ? BranchMaster.Status.ToString() : " ";

        //     try
        //     {
        //         // //Mandatory field validation
        //         // if (string.IsNullOrWhiteSpace(BranchMaster.Branchname))
        //         // {
        //         //     dto.transtatus.result = false;
        //         //     dto.transtatus.lstErrorItem.Add(
        //         //         new ErrorItem
        //         //         {
        //         //             ErrorNo = "BRANCH_NAME_REQUIRED",
        //         //             Message = "Branch Name is required."
        //         //         }
        //         //     );
        //         // }
        //         // if (string.IsNullOrWhiteSpace(BranchMaster.Branchcode))
        //         // {
        //         //     dto.transtatus.result = false;
        //         //     dto.transtatus.lstErrorItem.Add(
        //         //         new ErrorItem
        //         //         {
        //         //             ErrorNo = "BRANCH_CODE_REQUIRED",
        //         //             Message = "Branch Code is required."
        //         //         }
        //         //     );
        //         // }
        //         // // Validation 2: Generate Route Code in Backend (if not provided)
        //         // if (string.IsNullOrEmpty(BranchMaster.Branchcode))
        //         // {
        //         //     // Generate the Route Code here, e.g., using a method.
        //         //     BranchMaster.Branchcode = await GenerateUniqueCode();
        //         // }
        //         // //Check whether mobile no is not null
        //         // if (string.IsNullOrWhiteSpace(BranchMaster.Mobilenumber))
        //         // {
        //         //     dto.transtatus.result = false;
        //         //     dto.transtatus.lstErrorItem.Add(
        //         //         new ErrorItem
        //         //         {
        //         //             ErrorNo = "MOBILE_NUMBER_REQUIRED",
        //         //             Message = "Mobile Number is required."
        //         //         }
        //         //     );
        //         // }
        //         // //check the length of mobile no
        //         // if (BranchMaster.Mobilenumber.Length > 15)
        //         // {
        //         //     dto.transtatus.result = false;
        //         //     dto.transtatus.lstErrorItem.Add(
        //         //         new ErrorItem
        //         //         {
        //         //             ErrorNo = "MOBILE_NUMBER_LENGTH_EXCEEDED",
        //         //             Message = "Mobile Number should be up to 15 characters long."
        //         //         }
        //         //     );
        //         // }
        //         // //check the format of mobile no
        //         // if (!Regex.IsMatch(BranchMaster.Mobilenumber, @"^\d+$"))
        //         // {
        //         //     dto.transtatus.result = false;
        //         //     dto.transtatus.lstErrorItem.Add(
        //         //         new ErrorItem
        //         //         {
        //         //             ErrorNo = "MOBILE_NUMBER_INVALID_FORMAT",
        //         //             Message = "Mobile Number should contain only numeric characters."
        //         //         }
        //         //     );
        //         // }
        //         // //check if the email is not null
        //         // if (string.IsNullOrWhiteSpace(BranchMaster.Emailid))
        //         // {
        //         //     dto.transtatus.result = false;
        //         //     dto.transtatus.lstErrorItem.Add(
        //         //         new ErrorItem
        //         //         {
        //         //             ErrorNo = "EMAIL_REQUIRED",
        //         //             Message = "Email Address is required."
        //         //         }
        //         //     );
        //         // }
        //         // //check the length of the email
        //         // if (BranchMaster.Emailid.Length > 50)
        //         // {
        //         //     dto.transtatus.result = false;
        //         //     dto.transtatus.lstErrorItem.Add(
        //         //         new ErrorItem
        //         //         {
        //         //             ErrorNo = "EMAIL_LENGTH_EXCEEDED",
        //         //             Message = "Email Address should be up to 50 characters long."
        //         //         }
        //         //     );
        //         // }
        //         // //validation for allowing special characters in the email
        //         // if (
        //         //     !Regex.IsMatch(
        //         //         BranchMaster.Emailid,
        //         //         @"^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        //         //     )
        //         // )
        //         // {
        //         //     dto.transtatus.result = false;
        //         //     dto.transtatus.lstErrorItem.Add(
        //         //         new ErrorItem
        //         //         {
        //         //             ErrorNo = "EMAIL_FORMAT_INVALID",
        //         //             Message = "Email Address format is invalid."
        //         //         }
        //         //     );
        //         // }
        //         // //check if GST NUMBER is not null
        //         // if (string.IsNullOrWhiteSpace(BranchMaster.Gstno))
        //         // {
        //         //     dto.transtatus.result = false;
        //         //     dto.transtatus.lstErrorItem.Add(
        //         //         new ErrorItem
        //         //         {
        //         //             ErrorNo = "GST_NUMBER_REQUIRED",
        //         //             Message = "GST Number is required."
        //         //         }
        //         //     );
        //         // }
        //         // //check the character limit of the GST NUMBER
        //         // if (BranchMaster.Gstno.Length > 15)
        //         // {
        //         //     dto.transtatus.result = false;
        //         //     dto.transtatus.lstErrorItem.Add(
        //         //         new ErrorItem
        //         //         {
        //         //             ErrorNo = "GST_NUMBER_LENGTH_EXCEEDED",
        //         //             Message = "GST Number should be up to 15 characters long."
        //         //         }
        //         //     );
        //         // }
        //         // //Validation for alphanumeric characters
        //         // if (!Regex.IsMatch(BranchMaster.Gstno, "^[a-zA-Z0-9]+$"))
        //         // {
        //         //     dto.transtatus.result = false;
        //         //     dto.transtatus.lstErrorItem.Add(
        //         //         new ErrorItem
        //         //         {
        //         //             ErrorNo = "GST_NUMBER_INVALID_FORMAT",
        //         //             Message = "GST Number should contain only alphanumeric characters."
        //         //         }
        //         //     );
        //         // }
        //         // if (existingBranchWithSameGST != null)
        //         // {
        //         //     dto.transtatus.result = false;
        //         //     dto.transtatus.lstErrorItem.Add(
        //         //         new ErrorItem
        //         //         {
        //         //             ErrorNo = "GST_NUMBER_DUPLICATE",
        //         //             Message = "GST Number is already associated with another branch."
        //         //         }
        //         //     );
        //         // }
        //     }
        //     catch (Exception ex)
        //     {
        //         dto.transtatus.result = false;
        //         dto.transtatus.lstErrorItem.Add(
        //             new ErrorItem { ErrorNo = "VM0000", Message = ex.Message }
        //         );
        //     }
        // }

        // public async Task<string> GenerateUniqueCode()
        // {
        //     string documentno = "";
        //     string documentid = "15";
        //     string series = "45";
        //     using (dapperContext)
        //     {
        //         var spcall = await dapperContext.ExecuteStoredProcedureAsync(
        //             spName: "GetPrimaryKey",
        //             new { documentid, series }
        //         );
        //         documentno = (await spcall.ReadAsync<string>()).SingleOrDefault();
        //     }
        //     return documentno;
        // }



    }
}
