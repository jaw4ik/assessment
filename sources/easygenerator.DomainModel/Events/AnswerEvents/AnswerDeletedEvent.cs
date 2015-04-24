using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.AnswerEvents
{
    public class AnswerDeletedEvent : AnswerEvent
    {
        public Question Question { get; private set; }

        public AnswerDeletedEvent(Question question, Answer answer)
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
