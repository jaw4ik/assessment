using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents;

namespace easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events
{
    public class HotSpotPolygonChangedEvent : HotSpotPolygonEvent
    {
        public HotSpotPolygonChangedEvent(HotSpotPolygon polygon)
            : base(polygon)
        {

        }
    }
}