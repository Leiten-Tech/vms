using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class VisitAssetsDetail
    {
        public long AssetId { get; set; }
        public long VisitorDetailId { get; set; }
        public string AssetName { get; set; }
        public string AssetNo { get; set; }
        public string AssetQty { get; set; }

        public virtual VisitInformationDetail VisitorDetail { get; set; }
    }
}
