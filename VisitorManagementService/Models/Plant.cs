using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Plant
    {
        public Plant()
        {
            PlantNotificationDetails = new HashSet<PlantNotificationDetail>();
        }

        public long PlantId { get; set; }
        public string PlantCode { get; set; }
        public string PlantName { get; set; }
        public int PlantType { get; set; }
        public string Address { get; set; }
        public string GeoLocation { get; set; }
        public long CountryId { get; set; }
        public long CityId { get; set; }
        public long StateId { get; set; }
        public long CompanyId { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string UrlToken { get; set; }
        public string CheckToken { get; set; }
        public bool? IsAutomaticApprove { get; set; }
        public decimal? AlertAfterMins { get; set; }
        public bool? IsNotification { get; set; }
        public decimal? ReportTimer { get; set; }
        public string ToMail { get; set; }
        public string CcMail { get; set; }
        public bool? IsDocMandatory { get; set; }
        public bool? IsFileMandatory { get; set; }

        public virtual ICollection<PlantNotificationDetail> PlantNotificationDetails { get; set; }
    }
}
