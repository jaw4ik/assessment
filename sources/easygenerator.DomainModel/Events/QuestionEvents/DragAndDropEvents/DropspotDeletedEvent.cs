using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents
{
    public class DropspotDeletedEvent: DropspotEvent
    {
        public Question Question { get; private set; }

        public DropspotDeletedEvent(Question question, Dropspot dropspot)
            : base(dropspot)
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
