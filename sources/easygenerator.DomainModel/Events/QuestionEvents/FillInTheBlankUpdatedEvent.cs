using System.Collections.Generic;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents
{
    public class FillInTheBlankUpdatedEvent : QuestionEvent
    {
        public ICollection<BlankAnswer> Answers { get; private set; }

        public FillInTheBlankUpdatedEvent(Question question, ICollection<BlankAnswer> answers)
            : base(question)
        {
            ThrowIfAnswersIsInvalid(answers);

            Answers = answers;
        }

        private void ThrowIfAnswersIsInvalid(ICollection<BlankAnswer> answers)
        {
            ArgumentValidation.ThrowIfNull(answers, "answers");
        }
    }
}
