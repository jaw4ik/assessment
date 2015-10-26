using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents.ScenarioEvents
{
    public class ScenarioDataUpdatedEvent : QuestionEvent
    {
        public string ProjectId { get; set; }
        public string EmbedCode { get; set; }
        public string EmbedUrl { get; set; }
        public string ProjectArchiveUrl { get; set; }

        public ScenarioDataUpdatedEvent(Question question, string projectId, string embedCode, string embedUrl, string projectArchiveUrl)
            : base(question)
        {
            ProjectId = projectId;
            EmbedCode = embedCode;
            EmbedUrl = embedUrl;
            ProjectArchiveUrl = projectArchiveUrl;
        }
    }
}
