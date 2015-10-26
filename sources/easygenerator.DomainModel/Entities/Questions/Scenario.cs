using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Events.QuestionEvents.ScenarioEvents;

namespace easygenerator.DomainModel.Entities.Questions
{
    public class Scenario : Question
    {
        public Scenario() { }
        public Scenario(string title, int masteryScore, string createdBy)
            : base(title, createdBy)
        {
            MasteryScore = masteryScore;
        }

        public string ProjectId { get; set; }
        public string EmbedCode { get; set; }
        public string EmbedUrl { get; set; }
        public string ProjectArchiveUrl { get; set; }
        public int MasteryScore { get; set; }

        public void UpdateData(string projectId, string embedCode, string embedUrl, string projectArchiveUrl, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            ProjectId = projectId;
            EmbedCode = embedCode;
            EmbedUrl = embedUrl;
            ProjectArchiveUrl = projectArchiveUrl;
            MarkAsModified(modifiedBy);

            RaiseEvent(new ScenarioDataUpdatedEvent(this, projectId, embedCode, embedUrl, projectArchiveUrl));
        }

        public void UpdateMasteryScore(int masteryScore, string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            MasteryScore = masteryScore;
            MarkAsModified(modifiedBy);

            RaiseEvent(new ScenarioMasteryScoreUpdatedEvent(this, masteryScore));
        }
    }
}
