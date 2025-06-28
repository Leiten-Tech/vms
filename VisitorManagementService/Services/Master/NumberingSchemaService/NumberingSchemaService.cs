using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Services.Master.CommonInterface;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;
namespace VisitorManagementMySQL.Services.Master.NumberingSchemaService
{
    public class NumberingSchemaService : INumberingSchemaService
    {

        private readonly NumberingSchemaDTO dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;

        public NumberingSchemaService(
          DbContextHelper _dbContextHelper,
           IDapperContext _dapperContext)
        {

            dto = new NumberingSchemaDTO();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }


        public async Task<object> Create(JObject obj)
        {
            try
            {
                NumberingSchema NumberingSchema = obj["NumberingSchema"].ToObject<NumberingSchema>();
                dto.NumberingSchema = NumberingSchema;
                var Function = await DbContext.Functions.Where(a => a.FunctionId == NumberingSchema.DocumentId && a.Status == 1).SingleOrDefaultAsync();
                await ValidateNumberingSchemaForCreateAsync(dto);
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    generateSequence(Function.FunctionId);
                    var Functionname = Function.FunctionName.ToUpper();
                    var sequencename = String.Join("", Functionname.Split(" "));
                    NumberingSchema.SequenceName = sequencename + "Seq";
                    NumberingSchema.WSequenceName = "W_" + sequencename + "Seq";
                    DbContext.Add(NumberingSchema);
                    await DbContext.SaveChangesAsync();
                    dto.transtatus.result = true;
                    dto.transtatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "Created Successfully"
                   }
                    );
                }
            }
            catch (Exception ex)
            {

                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );

            }
            return dto;
        }

        public async void generateSequence(int Functionid)
        {
            using (dapperContext)
            {
                var spcall = await dapperContext.ExecuteStoredProcedureAsync(spName: "SPGenerateSequence", new
                {
                    Functionid,
                });
            }
        }

        public async Task ValidateNumberingSchemaForCreateAsync(NumberingSchemaDTO dto)
        {

            dto.transtatus.result = true;
            var Function = await DbContext.Functions.Where(a => a.FunctionId == dto.NumberingSchema.DocumentId && a.Status == 1).SingleOrDefaultAsync();
            var NumberingSchemaData = await DbContext.NumberingSchemas.Where(a => a.DocumentId == dto.NumberingSchema.DocumentId && a.Status == 1).ToListAsync();
            if (NumberingSchemaData.Count > 0)
            {
                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = $"Document Name: {Function.FunctionName} is already exists."
                    }
                );
            }
        }

        public async Task<object> ChangeStatus(JObject obj)
        {

            int NumberSchemaId = obj["NumberSchemaId"].ToObject<int>();
            try
            {
                NumberingSchema NumberingSchema = DbContext.NumberingSchemas.Where(y => y.NumberingSchemaId == NumberSchemaId).SingleOrDefault();
                NumberingSchema.Status = 2;
                NumberingSchema.ModifiedOn = DateTime.Now;
                DbContext.NumberingSchemas.Update(NumberingSchema);
                await DbContext.SaveChangesAsync();
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "Status Changed Successfully"
                   }
               );
            }
            catch (Exception ex)
            {

                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );

            }

            return dto;
        }



        public async Task<object> CreateInitialize(JObject obj)
        {
            try
            {
                dto.transtatus.result = true;
                int NumberingSchemaId = obj["NumberingSchemaId"].ToObject<int>();
                dto.DocumentList = await DbContext.Functions.Where(a => a.Status == 1).ToListAsync();
                dto.StatusList = await DbContext.Metadata.Where(q => q.MetaTypeCode == "STA").ToListAsync();
                dto.SymbolList = await DbContext.Metadata.Where(q => q.MetaTypeCode == "SYM").ToListAsync();
                dto.DateFormatList = await DbContext.Metadata.Where(q => q.MetaTypeCode == "DTF").ToListAsync();

                if (NumberingSchemaId > 0)
                {
                    dto.NumberingSchema = await DbContext.NumberingSchemas.Where(a => a.NumberingSchemaId == NumberingSchemaId).SingleOrDefaultAsync();
                }

                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                   new ErrorItem
                   {
                       Message = "Something Went Wrong, Please Try Again."
                   }
               );
            }
            catch (Exception ex)
            {

                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );

            }


            return dto;
        }

        public async Task<object> SearchInitialize(JObject input)
        {
            try
            {
                dto.transtatus.result = true;
                dto.NumberingSchemaViewList = await DbContext.NumberingSchemaSearchViews.ToListAsync();
            }
            catch (Exception ex)
            {

                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
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
            NumberingSchema NumberingSchemaData = obj["NumberingSchema"].ToObject<NumberingSchema>();

            try
            {
                DbContext.NumberingSchemas.Update(NumberingSchemaData);
                await DbContext.SaveChangesAsync();
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                      new ErrorItem
                      {
                          Message = "Updated Successfully"
                      });
            }
            catch (Exception ex)
            {

                dto.transtatus.result = false;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem
                    {
                        ErrorNo = "VM0000",
                        Message = ex.Message
                    }
                );
            }
            return dto;
        }
    }
}