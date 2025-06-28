using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Supplier
    {
        public Supplier()
        {
            SupplierBillingdetails = new HashSet<SupplierBillingdetail>();
        }

        public long CompanyId { get; set; }
        public long PlantId { get; set; }
        public long SupplierId { get; set; }
        public long SupplierTypeId { get; set; }
        public int SupplierCategoryId { get; set; }
        public string SupplierCode { get; set; }
        public string SupplierName { get; set; }
        public int? SeriesId { get; set; }
        public string SupplierPanNo { get; set; }
        public string SupplierTinNo { get; set; }
        public string SupplierEccNo { get; set; }
        public string SupplierVatNo { get; set; }
        public string SupplierGstNo { get; set; }
        public string SupplierCstNo { get; set; }
        public string SupplierAreaCode { get; set; }
        public bool? SupplierIsLocal { get; set; }
        public string SupplierImageName { get; set; }
        public string SupplierImageUrl { get; set; }
        public string SupplierMobileNo { get; set; }
        public string SupplierMailId { get; set; }
        public string SupplierMobileNo2 { get; set; }
        public string SupplierMailId2 { get; set; }
        public long? CountryId { get; set; }
        public long? StateId { get; set; }
        public long? CityId { get; set; }
        public string Address { get; set; }
        public int? Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public virtual ICollection<SupplierBillingdetail> SupplierBillingdetails { get; set; }
    }
}
