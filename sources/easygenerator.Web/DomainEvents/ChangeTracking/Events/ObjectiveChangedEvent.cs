using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events.ObjectiveEvents;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Events
{
    public class ObjectiveChangedEvent : ObjectiveEvent
    {
        public ObjectiveChangedEvent(Objective objective)
            : base(objective)
        {
        }
    }
}