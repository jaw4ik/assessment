using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.HotSpotEvents;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Trackers
{
    public class HotSpotPolygonChangeTracker :
        IDomainEventHandler<HotSpotPolygonUpdatedEvent>,
        IDomainEventHandler<HotSpotPolygonCreatedEvent>
    {
        private readonly IDomainEventPublisher _eventPublisher;

        public HotSpotPolygonChangeTracker(IDomainEventPublisher eventPublisher)
        {
            _eventPublisher = eventPublisher;
        }

        #region Handlers

        public void Handle(HotSpotPolygonUpdatedEvent args)
        {
            RaiseHotSpotPolygonChangedEvent(args.HotSpotPolygon);
        }

        public void Handle(HotSpotPolygonCreatedEvent args)
        {
            RaiseHotSpotPolygonChangedEvent(args.HotSpotPolygon);
        }

        #endregion

        private void RaiseHotSpotPolygonChangedEvent(HotSpotPolygon polygon)
        {
            _eventPublisher.Publish(new HotSpotPolygonChangedEvent(polygon));
        }
    }
}