using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents.ScenarioEvents
{
    public class ScenarioMasteryScoreUpdatedEvent : QuestionEvent
    {
        public int MasteryScore { get; set; }

        public ScenarioMasteryScoreUpdatedEvent(Question question, int masteryScore)
            : base(question)
        {
            MasteryScore = masteryScore;
        }
    }
}
