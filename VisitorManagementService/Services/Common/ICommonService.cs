using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using VisitorManagementMySQL.ContextHelper;
using VisitorManagementMySQL.Entities;
using VisitorManagementMySQL.Models;

namespace VisitorManagementMySQL.Services.Common
{
    public interface ICommonService
    {
        object VisitorLogSave(Visitor visitor, DbContextHelper dbContextHelper);
        Task<CommonDto> SendCheckOutTimer(List<dynamic> visitor);
        Task<JObject> GetLicData(JObject checkObj);
        Task CheckForUnsentNotifications(object state);
        void SetCache<T>(string key, T value, TimeSpan expiration);
        T GetCache<T>(string key);
    }
}
