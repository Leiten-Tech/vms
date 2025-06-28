using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class Material
    {
        public long MaterialId { get; set; }
        public string MaterialCode { get; set; }
        public long MaterialType { get; set; }
        public long MaterialCategoryId { get; set; }
        public long MaterialSubCategoryId { get; set; }
        public string MaterialName { get; set; }
        public string BrandName { get; set; }
        public decimal PurchasePrice { get; set; }
        public string MaterialImageName { get; set; }
        public string MaterialImageUrl { get; set; }
        public int? Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public int Uom { get; set; }
    }
}
