using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.AnswerEvents;

namespace easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events
{
    public class AnswerChangedEvent : AnswerEvent
    {
        public AnswerChangedEvent(Answer answer)
            : base(answer)
        {

        }
    }
}