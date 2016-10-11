using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents;

namespace easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events
{
    public class SingleSelectImageAnswerChangedEvent : SingleSelectImageAnswerEvent
    {
        public SingleSelectImageAnswerChangedEvent(SingleSelectImageAnswer answer)
            : base(answer)
        {

        }
    }
}