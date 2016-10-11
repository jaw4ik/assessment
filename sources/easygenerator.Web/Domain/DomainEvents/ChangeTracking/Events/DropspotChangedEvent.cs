using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents;

namespace easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events
{
    public class DropspotChangedEvent : DropspotEvent
    {
        public DropspotChangedEvent(Dropspot dropsot)
            : base(dropsot)
        {

        }
    }
}