using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents
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
