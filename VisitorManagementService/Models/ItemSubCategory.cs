using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class ItemSubCategory
    {
        public int Itemsubcategoryid { get; set; }
        public int? Itemcategoryid { get; set; }
        public string Itemsubcategorycode { get; set; }
        public string Itemsubcategoryname { get; set; }
        public int? Itemsubcategorystatus { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual ItemCategory Itemcategory { get; set; }
    }
}
