using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.AnswerEvents
{
    public class MultiplechoiceAnswerCorrectnessUpdateEvent : AnswerEvent
    {
        public MultiplechoiceAnswerCorrectnessUpdateEvent(Answer answer)
            : base(answer)
        {
        }
    }
}
