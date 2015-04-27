using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents
{
    public class SingleSelectImageAnswerCreatedEvent : SingleSelectImageAnswerEvent
    {
        public SingleSelectImageAnswerCreatedEvent(SingleSelectImageAnswer answer)
            : base(answer)
        {

        }
    }
}
