using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents
{
    public class SingleSelectImageAnswerDeletedEvent : SingleSelectImageAnswerEvent
    {
        public SingleSelectImage Question { get; private set; }

        public SingleSelectImageAnswerDeletedEvent(SingleSelectImageAnswer answer, SingleSelectImage question)
            : base(answer)
        {
            Question = question;
        }
    }
}
