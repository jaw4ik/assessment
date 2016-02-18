using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.ObjectiveEvents;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Trackers
{
    public class ObjectiveChangeTracker :
        IDomainEventHandler<ObjectiveImageUrlUpdatedEvent>,
        IDomainEventHandler<ObjectiveTitleUpdatedEvent>,
        IDomainEventHandler<ObjectiveLearningObjectiveUpdatedEvent>,
        IDomainEventHandler<QuestionsReorderedEvent>,
        IDomainEventHandler<QuestionsDeletedEvent>
    {
        private readonly IDomainEventPublisher _eventPublisher;

        public ObjectiveChangeTracker(IDomainEventPublisher eventPublisher)
        {
            _eventPublisher = eventPublisher;
        }

        #region Handlers

        public void Handle(ObjectiveImageUrlUpdatedEvent args)
        {
            RaiseObjectiveChangedEvent(args.Objective);
        }

        public void Handle(ObjectiveTitleUpdatedEvent args)
        {
            RaiseObjectiveChangedEvent(args.Objective);
        }

        public void Handle(ObjectiveLearningObjectiveUpdatedEvent args)
        {
            RaiseObjectiveChangedEvent(args.Objective);
        }

        public void Handle(QuestionsReorderedEvent args)
        {
            RaiseObjectiveChangedEvent(args.Objective);
        }

        public void Handle(QuestionsDeletedEvent args)
        {
            RaiseObjectiveChangedEvent(args.Objective);
        }

        #endregion

        private void RaiseObjectiveChangedEvent(Objective objective)
        {
            _eventPublisher.Publish(new ObjectiveChangedEvent(objective));
        }
    }
}