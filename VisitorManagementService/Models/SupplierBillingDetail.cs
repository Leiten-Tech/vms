using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class SupplierBillingdetail
    {
        public long SupplierBillingId { get; set; }
        public long SupplierId { get; set; }
        public long CompanyId { get; set; }
        public long PlantId { get; set; }
        public string BillingAddressOne { get; set; }
        public string BillingAddressTwo { get; set; }
        public long CityId { get; set; }
        public long StateId { get; set; }
        public long CountryId { get; set; }
        public string BillingPincode { get; set; }
        public string BillingContactPerson { get; set; }
        public string BillingPhoneOne { get; set; }
        public string BillingPhoneTwo { get; set; }
        public string BillingMobileNo { get; set; }
        public string BillingMailId { get; set; }
        public int? Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string DocumentName { get; set; }
        public string DocumentUrl { get; set; }

        public virtual Supplier Supplier { get; set; }
    }
}
