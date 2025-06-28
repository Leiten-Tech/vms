using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class ItemCategory
    {
        public ItemCategory()
        {
            ItemSubCategories = new HashSet<ItemSubCategory>();
        }

        public int Itemcategoryid { get; set; }
        public string Itemcategorycode { get; set; }
        public string Itemcategoryname { get; set; }
        public int? Itemcategorystatus { get; set; }
        public int Createdby { get; set; }
        public DateTime Createdon { get; set; }
        public int? Modifiedby { get; set; }
        public DateTime? Modifiedon { get; set; }

        public virtual ICollection<ItemSubCategory> ItemSubCategories { get; set; }
    }
}
