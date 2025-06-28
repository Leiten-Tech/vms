using System.Collections.Generic;
using VisitorManagementMySQL.Utils;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Entities
{
    public class MaterialDto
    {
   public List<Material> MaterialMasterList { get; set; }
        public List<dynamic> MaterialList { get; set; }
        public List<Metadatum> StatusList { get; set; }
        public List<dynamic> UomList { get; set; }
        public List<MaterialType> MaterialTypeList { get; set; }
        public List<MaterialType> MaterialTypeOnChange { get; set; }
        public List<MaterialCategory> MaterialCategoryList { get; set; }
        public List<MaterialCategory> MaterialCategoryOnChange { get; set; }
        public List<MaterialSubCategory> MaterialSubCategoryList { get; set; }
        public List<MaterialSubCategory> MaterialSubCategoryOnChange { get; set; }
        public Material HdrTable { get; set; }
        public ErrorContext transtatus { get; set; }

    }
}