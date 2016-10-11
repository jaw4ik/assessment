using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents.DragAndDropEvents;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;

namespace easygenerator.Web.Domain.DomainEvents.ChangeTracking.Trackers
{
    public class DropspotChangeTracker :
        IDomainEventHandler<DropspotCreatedEvent>,
        IDomainEventHandler<DropspotPositionChangedEvent>,
        IDomainEventHandler<DropspotTextChangedEvent>
    {
        private readonly IDomainEventPublisher _eventPublisher;

        public DropspotChangeTracker(IDomainEventPublisher eventPublisher)
        {
            _eventPublisher = eventPublisher;
        }

        #region Handlers

        public void Handle(DropspotCreatedEvent args)
        {
            RaiseDropspotChangedEvent(args.Dropspot);
        }

        public void Handle(DropspotPositionChangedEvent args)
        {
            RaiseDropspotChangedEvent(args.Dropspot);
        }

        public void Handle(DropspotTextChangedEvent args)
        {
            RaiseDropspotChangedEvent(args.Dropspot);
        }

        #endregion

        private void RaiseDropspotChangedEvent(Dropspot dropspot)
        {
            _eventPublisher.Publish(new DropspotChangedEvent(dropspot));
        }
    }
}