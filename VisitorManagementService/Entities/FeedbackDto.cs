using System.Collections.Generic;
using VisitorManagementMySQL.Models;
using VisitorManagementMySQL.Utils;

namespace VisitorManagementMySQL.Entities
{
    public class FeedbackDto
    {
        public ErrorContext tranStatus { get; set; }

        public List<Metadatum> StatusList { get; set; }

        public List<Metadatum> FeedbackGroups { get; set; }

        public List<dynamic> FeedbackList { get; set; }

        public dynamic FeedbackHdr { get; set; }

        public List<dynamic> FeedbackDetail { get; set; }
        
    }
}