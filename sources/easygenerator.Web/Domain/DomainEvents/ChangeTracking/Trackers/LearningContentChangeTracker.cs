using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.Web.Domain.DomainEvents.ChangeTracking.Events;

namespace easygenerator.Web.Domain.DomainEvents.ChangeTracking.Trackers
{
    public class LearningContentChangeTracker :
        IDomainEventHandler<LearningContentCreatedEvent>,
        IDomainEventHandler<LearningContentUpdatedEvent>
    {
         private readonly IDomainEventPublisher _eventPublisher;

         public LearningContentChangeTracker(IDomainEventPublisher eventPublisher)
        {
            _eventPublisher = eventPublisher;
        }

        #region Handlers

        public void Handle(LearningContentCreatedEvent args)
        {
            RaiseLearningContentChangedEvent(args.LearningContent);
        }

        public void Handle(LearningContentUpdatedEvent args)
        {
            RaiseLearningContentChangedEvent(args.LearningContent);
        }

        #endregion 

        private void RaiseLearningContentChangedEvent(LearningContent content)
        {
            _eventPublisher.Publish(new LearningContentChangedEvent(content));
        }
    }
}