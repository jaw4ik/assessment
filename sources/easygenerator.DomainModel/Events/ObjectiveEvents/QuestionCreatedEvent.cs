using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.ObjectiveEvents
{
    public class QuestionCreatedEvent
    {
        public Question Question { get; private set; }

        public QuestionCreatedEvent( Question question)
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
