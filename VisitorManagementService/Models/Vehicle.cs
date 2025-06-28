using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Vehicle
    {
        public Vehicle()
        {
            VehicleDocumentDetails = new HashSet<VehicleDocumentDetail>();
        }

        public long VehicleId { get; set; }
        public string VehicleCode { get; set; }
        public string VehicleName { get; set; }
        public long CompanyId { get; set; }
        public long PlantId { get; set; }
        public int VehicleType { get; set; }
        public string VehicleNo { get; set; }
        public long? DriverId { get; set; }
        public long? SupplierId { get; set; }
        public string SupplierMobileNo { get; set; }
        public string SupplierAddress { get; set; }
        public string VehicleModel { get; set; }
        public DateTime? VehicleFcDate { get; set; }
        public DateTime? ServiceDate { get; set; }
        public string VehicleToken { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string Remarks { get; set; }

        public virtual ICollection<VehicleDocumentDetail> VehicleDocumentDetails { get; set; }
    }
}
