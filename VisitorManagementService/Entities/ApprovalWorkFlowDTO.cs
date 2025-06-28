using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class ApprovalWorkFlowDTO
    {
        public ErrorContext tranStatus { get; set; }
        public dynamic VisitorEntryHeader { get; set; }
        public List<VisitorEntryDetail> VisitorEntryDetail { get; set; }
        public List<VisitorEntryBelongingDetail> VisitorEntryBelongingDetail { get; set; }
        public List<Visitor> UpdatedVisitorNameList { get; set; }

        public List<dynamic> workflowpopups { get; set; }
        public List<dynamic> CheckoutTimerList { get; set; }
        public int ConditionExists { get; set; }
        public int CurrLvlSts { get; set; }
        public int StatusSP { get; set; }
        public int NextStageCountSP { get; set; }
        public string ConditionList { get; set; }
        public List<dynamic> ApprovalList { get; set; }
        public List<dynamic> UpdatedApprovalDetailList { get; set; }
        public ApprovalDetail NextApprovalDetail { get; set; }
        public List<dynamic> ApprovalDetailList { get; set; }
    }
    public class ApprovalRequest
    {
        public long? companyid { get; set; }
        public long? plantid { get; set; }
        public long? requesterid { get; set; }
        public string? documentno { get; set; }
        public int? approvalid { get; set; }
        public int? approvaldetailid { get; set; }
        public int? documentid { get; set; }
        public int? documentactivityid { get; set; }
        public long? documentdetailid { get; set; }
        public string? remarks1 { get; set; }
        public string? remarks2 { get; set; }
        public int? status { get; set; }
        public long? approverid { get; set; }
        public int? levelid { get; set; }
        public long? alternateuser { get; set; }
        public string? parentid { get; set; }
        public long? userid { get; set; }
        public DateTime? requestfromdate { get; set; }
        public DateTime? requesttodate { get; set; }
        public byte? Isviewed { get; set; }
        // public List<DbParameter> GetCommandParams(DbCommand command)
        // {
        //     List<DbParameter> parameters = new List<DbParameter>();
        //     parameters.Add(GetSingleParam(command, "@companyid", this.companyid));
        //     parameters.Add(GetSingleParam(command, "@plantid", this.plantid));
        //     parameters.Add(GetSingleParam(command, "@requesterid", this.requesterid));
        //     parameters.Add(GetSingleParam(command, "@documentno", this.documentno));
        //     parameters.Add(GetSingleParam(command, "@documentid", this.documentid));
        //     parameters.Add(GetSingleParam(command, "@documentactivityid", this.documentactivityid));
        //     parameters.Add(GetSingleParam(command, "@documentdetailid", this.documentdetailid));
        //     parameters.Add(GetSingleParam(command, "@Status", this.status));
        //     parameters.Add(GetSingleParam(command, "@approverid", this.approverid));
        //     parameters.Add(GetSingleParam(command, "@levelid", this.levelid));
        //     parameters.Add(GetSingleParam(command, "@alternateuser", this.alternateuser));
        //     parameters.Add(GetSingleParam(command, "@remarks1", this.remarks1));
        //     parameters.Add(GetSingleParam(command, "@remarks2", this.remarks2));
        //     parameters.Add(GetSingleParam(command, "@parentid", this.parentid));
        //     parameters.Add(GetSingleParam(command, "@userid", this.userid));
        //     parameters.Add(GetSingleParam(command, "@requestfromdate", this.requestfromdate));
        //     parameters.Add(GetSingleParam(command, "@requesttodate", this.requesttodate));
        //     parameters.Add(GetSingleParam(command, "@isviewed", this.Isviewed));
        //     return parameters;
        // }
        // private DbParameter GetSingleParam(DbCommand command, string paramName, object Value)
        // {
        //     DbParameter Param = command.CreateParameter();
        //     Param.ParameterName = paramName;
        //     Param.DbType = GetDbType(Value);
        //     Param.Direction = ParameterDirection.Input;
        //     Param.Value = Value;
        //     return Param;
        // }
        // private DbType GetDbType(object Value)
        // {
        //     if (Value is Int16)
        //     {
        //         return DbType.Int16;
        //     }
        //     else if (Value is Int32)
        //     {
        //         return DbType.Int32;
        //     }
        //     else if (Value is Int64)
        //     {
        //         return DbType.Int64;
        //     }
        //     else if (Value is DateTime)
        //     {
        //         return DbType.DateTime;
        //     }
        //     else if (Value is string)
        //     {
        //         return DbType.String;
        //     }
        //     return default(DbType);
        // }
    }
}