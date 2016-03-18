using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.SectionEvents;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Trackers
{
    public class SectionChangeTracker :
        IDomainEventHandler<SectionImageUrlUpdatedEvent>,
        IDomainEventHandler<SectionTitleUpdatedEvent>,
        IDomainEventHandler<SectionLearningObjectiveUpdatedEvent>,
        IDomainEventHandler<QuestionsReorderedEvent>,
        IDomainEventHandler<QuestionsDeletedEvent>
    {
        private readonly IDomainEventPublisher _eventPublisher;

        public SectionChangeTracker(IDomainEventPublisher eventPublisher)
        {
            _eventPublisher = eventPublisher;
        }

        #region Handlers

        public void Handle(SectionImageUrlUpdatedEvent args)
        {
            RaiseSectionChangedEvent(args.Section);
        }

        public void Handle(SectionTitleUpdatedEvent args)
        {
            RaiseSectionChangedEvent(args.Section);
        }

        public void Handle(SectionLearningObjectiveUpdatedEvent args)
        {
            RaiseSectionChangedEvent(args.Section);
        }

        public void Handle(QuestionsReorderedEvent args)
        {
            RaiseSectionChangedEvent(args.Section);
        }

        public void Handle(QuestionsDeletedEvent args)
        {
            RaiseSectionChangedEvent(args.Section);
        }

        #endregion

        private void RaiseSectionChangedEvent(Section section)
        {
            _eventPublisher.Publish(new SectionChangedEvent(section));
        }
    }
}