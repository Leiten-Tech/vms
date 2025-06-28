using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using MailKit;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Services.Master.InstructionsService
{
    public class InstructionsService : IInstructionsService
    {
        private readonly InstructionsDTO dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;

        public InstructionsService(DbContextHelper _dbContextHelper, IDapperContext _dapperContext)
        {
            dto = new InstructionsDTO();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }

        public async Task<object> CreateInitialize(JObject obj)
        {
            try
            {
                string Type = "CreateInitialize";
                long InstructionsId = obj["InstructionsId"].ToObject<long>();
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_INSTRUCTIONS_CI",
                        new
                        {
                            Type,
                            InstructionsId,
                            CompanyId = (object)null,
                            RoleId = (object)null,
                            PlantId = (object)null,
                        }
                    );

                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.VisitorTypeList = (await spcall.ReadAsync<dynamic>()).ToList();
                    dto.PlantList = (await spcall.ReadAsync<Plant>()).ToList();
                    dto.CompanyList = (await spcall.ReadAsync<dynamic>()).ToList();
                    if (InstructionsId > 0)
                    {
                        dto.HdrTable = (await spcall.ReadAsync<Instruction>()).SingleOrDefault();
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

        public async Task<Object> OnChangeCompany(JObject obj)
        {
            try
            {
                string CompanyId = obj["CompanyId"].ToObject<string>();
                string Type = "OnChangeCompany";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_INSTRUCTIONS_CI",
                        new
                        {
                            Type,
                            CompanyId,
                            InstructionsId = (object)null,
                            RoleId = (object)null,
                            PlantId = (object)null,
                        }
                    );
                    dto.PlantList = (await spcall.ReadAsync<Plant>()).ToList();
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

        public async Task<object> Create(JObject obj)
        {
            try
            {
                Instruction Instruction = obj["Instruction"].ToObject<Instruction>();
                Instruction.Version = 1;

                // Check if there is any instruction with the same InstructionName, CompanyId, and PlantId
                bool instructionExists = DbContext
                    .Instructions.AsNoTracking()
                    .Any(y =>
                        y.InstructionName == Instruction.InstructionName
                        && y.CompanyId == Instruction.CompanyId
                        && y.PlantId == Instruction.PlantId
                    );

                if (instructionExists)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            Message =
                                $"Instruction Name :{Instruction.InstructionName} already exists. ",
                        }
                    );
                    return dto;
                }

                // Check if there is any instruction with the same VisitorTypeId for the given CompanyId and PlantId
                bool Instruct = DbContext
                    .Instructions.AsNoTracking()
                    .Any(y =>
                        y.CompanyId == Instruction.CompanyId
                        && y.PlantId == Instruction.PlantId
                        && y.VisitorTypeId == Instruction.VisitorTypeId
                    );

                if (Instruct)
                {
                    Metadatum VisitorTypeName = DbContext
                        .Metadata.Where(y => y.MetaSubId == Instruction.VisitorTypeId)
                        .SingleOrDefault();
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            Message =
                                $"Instruction with VisitorTypeId {VisitorTypeName.MetaSubDescription} already exists.",
                        }
                    );
                    return dto;
                }

                // Add the new Instruction if no duplicates are found
                DbContext.Instructions.Add(Instruction);
                await DbContext.SaveChangesAsync();

                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(new ErrorItem { Message = "Created Successfully" });
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

        public async Task<object> Update(JObject obj)
        {
            try
            {
                Instruction Instruction = obj["Instruction"].ToObject<Instruction>();
                long InstructionsId = (long)Instruction.InstructionsId;
                long PlantId = (long)Instruction.PlantId;
                long CompanyId = (long)Instruction.CompanyId;
                //  var Instructions = DbContext.Instructions.Where(y => y.InstructionName == Instruction.InstructionName && y.InstructionsId != Instruction.InstructionsId).AsNoTracking().SingleOrDefault();
                // if (Instructions != null)
                // {
                //     dto.transtatus.result = false;
                //     dto.transtatus.lstErrorItem.Add(
                //        new ErrorItem
                //        {
                //            Message = $"Instruction Name :{Instructions.InstructionName} already exists. "
                //        }
                //    );
                //     return dto;
                // }

                var currentInstruction = DbContext
                    .Instructions.AsNoTracking()
                    .Where(i =>
                        i.Version == Instruction.Version
                        && i.InstructionsId == Instruction.InstructionsId
                    )
                    .SingleOrDefault();

                if (currentInstruction != null)
                {
                    // Increment the version for the updated record
                    Instruction.Version = currentInstruction.Version + 1;
                }

                Instruction.InstructionsId = 0;
                DbContext.Instructions.Add(Instruction);
                await DbContext.SaveChangesAsync();
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(new ErrorItem { Message = "Updated Successfully" });
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

        public async Task<object> ChangeStatus(JObject obj)
        {
            try
            {
                long InstructionsId = obj["InstructionsId"].ToObject<long>();
                var isexistText = DbContext
                    .Instructions.Where(x => x.InstructionsId == InstructionsId)
                    .ToList();
                Instruction Instruction = DbContext
                    .Instructions.Where(y => y.InstructionsId == InstructionsId)
                    .SingleOrDefault();
                Instruction.Status = 2;
                DbContext.Instructions.Update(Instruction);
                await DbContext.SaveChangesAsync();
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { Message = "Status Changed Successfully" }
                );
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

        public async Task<object> SearchInitialize(JObject obj)
        {
            try
            {
                long InstructionsId = obj["InstructionsId"].ToObject<long>();
                string Type = "SearchInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_INSTRUCTIONS_CI",
                        new
                        {
                            Type,
                            InstructionsId,
                            CompanyId = (object)null,
                            RoleId = (object)null,
                            PlantId = (object)null,
                        }
                    );

                    dto.InstructionsList = (await spcall.ReadAsync<dynamic>()).ToList();
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
