using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events.LearningContentEvents;

namespace easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events
{
    public class LearningContentChangedEvent : LearningContentEvent
    {
        public LearningContentChangedEvent(LearningContent content)
            : base(content)
        {

        }
    }
}