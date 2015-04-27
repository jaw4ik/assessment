using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents
{
    public abstract class SingleSelectImageAnswerEvent : Event
    {
        public SingleSelectImageAnswer Answer { get; private set; }

        protected SingleSelectImageAnswerEvent(SingleSelectImageAnswer answer)
        {
            ThrowIfAnswerIsInvalid(answer);

            Answer = answer;
        }

        private void ThrowIfAnswerIsInvalid(SingleSelectImageAnswer answer)
        {
            ArgumentValidation.ThrowIfNull(answer, "answer");
        }
    }
}
