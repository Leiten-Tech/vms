using System;
using System.Collections.Generic;

#nullable disable

namespace VisitorManagementMySQL.Models
{
    public partial class User
    {
        public User()
        {
            UserBranchMaps = new HashSet<UserBranchMap>();
            UserCompanyMaps = new HashSet<UserCompanyMap>();
            UserGateMaps = new HashSet<UserGateMap>();
            UserPlantMaps = new HashSet<UserPlantMap>();
            UserRoleMaps = new HashSet<UserRoleMap>();
        }

        public long UserId { get; set; }
        public string UserCode { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public long CompanyId { get; set; }
        public long? PlantId { get; set; }
        public long? DefaultRoleId { get; set; }
        public long? DeptId { get; set; }
        public string UserTelNo { get; set; }
        public string UserEmail { get; set; }
        public int Status { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public bool? IsBlocked { get; set; }
        public string UserImageName { get; set; }
        public string UserImageUrl { get; set; }
        public long? GateId { get; set; }
        public string SecondaryMobileNo { get; set; }
        public string Address { get; set; }
        public string DigitalSign { get; set; }
        public string DigitalSignName { get; set; }

        public virtual ICollection<UserBranchMap> UserBranchMaps { get; set; }
        public virtual ICollection<UserCompanyMap> UserCompanyMaps { get; set; }
        public virtual ICollection<UserGateMap> UserGateMaps { get; set; }
        public virtual ICollection<UserPlantMap> UserPlantMaps { get; set; }
        public virtual ICollection<UserRoleMap> UserRoleMaps { get; set; }
    }
}
