using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Services.Master.DepartmentService
{
    public class DepartmentService : IDepartmentService
    {
        private readonly DepartmentDto dto;
        private readonly DbContextHelper DbContext;
        private readonly IDapperContext dapperContext;

        public DepartmentService(DbContextHelper _dbContextHelper, IDapperContext _dapperContext)
        {
            dto = new DepartmentDto();
            DbContext = _dbContextHelper;
            dapperContext = _dapperContext;
            dto.transtatus = new ErrorContext();
            dto.transtatus.lstErrorItem = new List<ErrorItem>();
        }

        public async Task<object> CreateInitialize(JObject obj)
        {
            int DeptId = obj["DeptId"].ToObject<int>();
            long CompanyId = obj["CompanyId"].ToObject<long>();
            long RoleId = obj["RoleId"].ToObject<long>();
            long PlantId = obj["PlantId"].ToObject<long>();
            string Type = "CreateInitialize";
            try
            {
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_DEPARTMENT_CI",
                        new
                        {
                            Type,
                            DeptId,
                            CompanyId,
                            RoleId,
                            PlantId,
                        }
                    );

                    dto.StatusList = (await spcall.ReadAsync<Metadatum>()).ToList();
                    dto.UserList = (await spcall.ReadAsync<dynamic>()).ToList();
                    if (DeptId > 0)
                    {
                        dto.HdrTable = (await spcall.ReadAsync<Department>()).SingleOrDefault();
                    }
                }
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { Message = "Something Went Wrong, Please Try Again." }
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
                int DeptId = obj["DeptId"].ToObject<int>();
                long CompanyId = obj["CompanyId"].ToObject<long>();
                long RoleId = obj["RoleId"].ToObject<long>();
                long PlantId = obj["PlantId"].ToObject<long>();
                string Type = "SearchInitialize";
                using (dapperContext)
                {
                    var spcall = await dapperContext.ExecuteStoredProcedureAsync(
                        spName: "SP_DEPARTMENT_CI",
                        new
                        {
                            Type,
                            DeptId,
                            CompanyId,
                            RoleId,
                            PlantId,
                        }
                    );

                    dto.DepartmentList = (await spcall.ReadAsync<dynamic>()).ToList();
                }
                dto.transtatus.result = true;
                dto.transtatus.lstErrorItem.Add(
                    new ErrorItem { Message = "Something Went Wrong, Please Try Again." }
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

        public async Task<object> Create(JObject obj)
        {
            try
            {
                Department Department = obj["Department"].ToObject<Department>();
                string DepartmentName = Department.DepartmentName;
                //if departmentname is already exists it show error
                var isExists = DbContext
                    .Departments.Where(x =>
                        x.DepartmentName.Equals(DepartmentName)
                        && x.CompanyId == Department.CompanyId &&
                        x.PlantId == Department.PlantId
                    )
                    .ToList();
                if (isExists.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                $"Department Name :{Department.DepartmentName} already exists. ",
                        }
                    );
                    return dto;
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    //Autogenerate Deptcode
                    Department.DepartmentCode = await GenerateUniqueCode();
                    // Department.DepartmentCode =null;
                    DbContext.Departments.Add(Department);
                    await DbContext.SaveChangesAsync();

                    dto.transtatus.result = true;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem { Message = "Created Successfully" }
                    );
                }
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
                Department Department = obj["Department"].ToObject<Department>();
                long DeptId = Department.DepartmentId;
                var isexistEmp = DbContext
                    .Employees.Where(x => x.DeptId == DeptId && x.Status == 1)
                    .ToList();
                var isexistVis = DbContext
                    .VisitorDetails.Where(x => x.DepartmentId == DeptId && x.Status == 1)
                    .ToList();
                // Department Department = DbContext.Departments.Where(y => y.DepartmentId == DeptId).SingleOrDefault();
                string DepartmentName = Department.DepartmentName;
                var isExists = DbContext
                    .Departments.Where(x =>
                        x.DepartmentName.Equals(DepartmentName)
                        && x.CompanyId == Department.CompanyId &&
                        x.PlantId == Department.PlantId
                        && x.DepartmentId != Department.DepartmentId
                    )
                    .ToList();
                if (isExists.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            ErrorNo = "VMS000",
                            Message =
                                $"Department Name :{Department.DepartmentName} already exists. ",
                        }
                    );
                    return dto;
                }
                if (Department.Status != 1)
                {
                    //var isexistEmp = DbContext.Employees.Where(x => x.DeptId == DeptId).ToList();
                    if (isexistEmp.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                Message =
                                    "Inactive not allowed. This Department is linked to active Employee.",
                            }
                        );
                        return dto;
                    }
                }
                if (Department.Status != 1)
                {
                    if (isexistVis.Count > 0)
                    {
                        dto.transtatus.result = false;
                        dto.transtatus.lstErrorItem.Add(
                            new ErrorItem
                            {
                                Message =
                                    "Inactive not allowed. This Department is linked to active Visitor.",
                            }
                        );
                        return dto;
                    }
                }
                if (dto.transtatus.lstErrorItem.Count == 0)
                {
                    DbContext.Departments.Update(Department);
                    await DbContext.SaveChangesAsync();
                    dto.transtatus.result = true;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem { Message = "Updated Successfully" }
                    );
                }
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
                int DeptId = obj["DeptId"].ToObject<int>();
                Department Department = DbContext
                    .Departments.Where(y => y.DepartmentId == DeptId)
                    .SingleOrDefault();
                var isexistEmp = DbContext
                    .Employees.Where(x => x.DeptId == DeptId && x.Status == 1)
                    .ToList();
                if (isexistEmp.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            Message =
                                "Inactive not allowed. This Department is linked to active Employee.",
                        }
                    );
                    return dto;
                }
                var isexistVis = DbContext
                    .VisitorDetails.Where(d => d.DepartmentId == DeptId && d.Status == 1)
                    .ToList();
                if (isexistVis.Count > 0)
                {
                    dto.transtatus.result = false;
                    dto.transtatus.lstErrorItem.Add(
                        new ErrorItem
                        {
                            Message =
                                "Inactive not allowed. This Department is linked to active Visitor.",
                        }
                    );
                    return dto;
                }
                Department.Status = 2;
                DbContext.Departments.Update(Department);
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

        public async Task<string> GenerateUniqueCode()
        {
            string documentno = "";
            string documentid = "18";
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
