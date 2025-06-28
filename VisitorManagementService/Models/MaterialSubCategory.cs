using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class MaterialSubCategory
    {
        public long MaterialSubCategoryId { get; set; }
        public string MaterialSubCategoryCode { get; set; }
        public string MaterialSubCategoryName { get; set; }
        public long MaterialCategoryId { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
