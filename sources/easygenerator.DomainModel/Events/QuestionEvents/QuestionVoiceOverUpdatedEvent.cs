using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents;

namespace easygenerator.DomainModel.Events.QuestionEvents
{
    public class QuestionVoiceOverUpdatedEvent : QuestionEvent
    {
        public QuestionVoiceOverUpdatedEvent(Question question)
            : base(question)
        {

        }
    }
}
