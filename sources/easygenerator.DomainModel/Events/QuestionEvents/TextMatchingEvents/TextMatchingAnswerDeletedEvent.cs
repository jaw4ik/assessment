using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents.TextMatchingEvents
{
    public class TextMatchingAnswerDeletedEvent : TextMatchingAnswerEvent
    {
        public Question Question { get; private set; }

        public TextMatchingAnswerDeletedEvent(Question question, TextMatchingAnswer answer)
            : base(answer)
        {
            ThrowIfQuestionIsInvalid(question);
            Question = question;
        }

        private void ThrowIfQuestionIsInvalid(Question question)
        {
            ArgumentValidation.ThrowIfNull(question, "question");
        }
    }
}
