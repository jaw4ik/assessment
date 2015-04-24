using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents
{
    public class SingleSelectImageAnswerImageUpdatedEvent : SingleSelectImageAnswerEvent
    {
        public SingleSelectImageAnswerImageUpdatedEvent(SingleSelectImageAnswer answer)
            : base(answer)
        {

        }
    }
}
