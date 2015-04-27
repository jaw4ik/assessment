using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents
{
    public abstract class TextMatchingAnswerEvent : Event
    {
        public TextMatchingAnswer Answer { get; private set; }

        protected TextMatchingAnswerEvent(TextMatchingAnswer answer)
        {
            ThrowIfAnswerIsInvalid(answer);

            Answer = answer;
        }

        private void ThrowIfAnswerIsInvalid(TextMatchingAnswer answer)
        {
            ArgumentValidation.ThrowIfNull(answer, "answer");
        }
    }
}
