using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events.SectionEvents;

namespace easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events
{
    public class SectionChangedEvent : SectionEvent
    {
        public SectionChangedEvent(Section section)
            : base(section)
        {
        }
    }
}