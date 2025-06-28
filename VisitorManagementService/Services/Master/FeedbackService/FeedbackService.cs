using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.ContextHelper;

namespace VisitorManagementMySQL.Services.Master.FeedbackService
{
    public class FeedbackService : IFeedbackService
    {
        private readonly FeedbackDto dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;
        public FeedbackService(DbContextHelper _dbContextHelper, IDapperContext _dapperContext)
        {
            dto = new FeedbackDto();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.tranStatus = new ErrorContext();
            dto.tranStatus.lstErrorItem = new List<ErrorItem>();

        }


        public async Task<object> CreateInitialize(JObject obj)
        {
            try
            {                
                string Type = "CreateInitialize";
                int FeedbackId = obj["FeedbackId"].ToObject<int>();
                 long? CompanyId = obj["CompanyId"].ToObject<long?>();
                long? PlantId = obj["PlantId"].ToObject<long?>();
                long? RoleId = obj["RoleId"].ToObject<long?>();
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_Feedback_CI", new
                    {
                        Type,
                        FeedbackId,   
                        CompanyId,
                        PlantId,
                        RoleId                   
                    });
                    dto.FeedbackGroups = (await spcall.ReadAsync<Metadatum>()).ToList(); 
                    
                    if(FeedbackId > 0)
                    {
                    dto.FeedbackHdr = (await spcall.ReadAsync<dynamic>()).SingleOrDefault();
                    dto.FeedbackDetail = (await spcall.ReadAsync<dynamic>()).ToList();
                    }                 
                }
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                  new ErrorItem
                  {
                      Message = "Something Went Wrong, Please Try Again."
                  }
              );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }
            return dto;
        }
        public async Task<object> SearchInitialize(JObject obj)
        {
             try
            {
                string Type = "SearchInitialize";
                int FeedbackId = obj["FeedbackId"].ToObject<int>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                 using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SP_Feedback_CI", new
                    {
                        Type,
                        FeedbackId,
                        CompanyId,
                        PlantId,
                        RoleId
                    });
                    dto.FeedbackList = (await spcall.ReadAsync<dynamic>()).ToList();
                }                
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                  new ErrorItem
                  {
                      Message = "Something Went Wrong, Please Try Again."
                  }
              );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }
            return dto;
        }
        public async Task<object> Create(JObject obj)
        {
            try
            {
                Feedback feedback = obj["Feedback"].ToObject<Feedback>();
                feedback.FeedbackDetails = obj["FeedbackDetail"].ToObject<List<FeedbackDetail>>();

                //already exists
                // var isExists = DbContext.Feedbacks.Where(x => x.FeedbackId == feedback.FeedbackId).ToList();
                // if (isExists.Count > 0)
                // {
                //     dto.tranStatus.result = false;
                //     dto.tranStatus.lstErrorItem.Add(new ErrorItem
                //     {
                //         ErrorNo = "VMS000",
                //         Message = "Feedback is already exists."
                //     });
                //     return dto;
                // }
                feedback.FeedbackCode = await GenerateUniqueCode();

                DbContext.Feedbacks.Add(feedback);
                await DbContext.SaveChangesAsync();
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "Submitted Successfully"
                   }
               );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }
            return dto;
        }
        public async Task<object> Update(JObject obj)
        {
            try
            {
                Feedback feedback = obj["Feedback"].ToObject<Feedback>();
                feedback.FeedbackDetails = obj["FeedbackDetail"].ToObject<List<FeedbackDetail>>();
                DbContext.Feedbacks.Update(feedback);
                await DbContext.SaveChangesAsync();
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "Updated Successfully"
                   }
               );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }
            return dto;
        }

        public async Task<object> ChangeStatus(JObject obj)
        {
            try
            {
                int FeedbackId= obj["FeedbackId"].ToObject<int>();
                Feedback feedback = DbContext.Feedbacks.Where(y => y.FeedbackId == FeedbackId).SingleOrDefault();
                feedback.Status = 2;
                DbContext.Feedbacks.Update(feedback);
                await DbContext.SaveChangesAsync();
                dto.tranStatus.result = true;
                dto.tranStatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "Status has been changed successfully"
                   }
               );
            }
            catch (Exception ex)
            {
                dto.tranStatus.result = false;
                dto.tranStatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }
            return dto;
        }

        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "44";
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