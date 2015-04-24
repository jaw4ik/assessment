using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents
{
    public class TextMatchingAnswerKeyChangedEvent: TextMatchingAnswerEvent
    {
        public TextMatchingAnswerKeyChangedEvent(TextMatchingAnswer answer)
            : base(answer)
        {
        }
    }
}
