using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Trackers
{
    public class CourseChangeTracker :
        IDomainEventHandler<CourseTitleUpdatedEvent>,
        IDomainEventHandler<CourseIntroductionContentUpdated>,
        IDomainEventHandler<CourseTemplateUpdatedEvent>,
        IDomainEventHandler<CourseObjectivesReorderedEvent>,
        IDomainEventHandler<CourseObjectiveRelatedEvent>,
        IDomainEventHandler<CourseObjectivesUnrelatedEvent>,
        IDomainEventHandler<CourseTemplateSettingsUpdated>
    {
        private readonly IDomainEventPublisher _eventPublisher;

        public CourseChangeTracker(IDomainEventPublisher publisher)
        {
            _eventPublisher = publisher;
        }

        public void Handle(CourseTitleUpdatedEvent args)
        {
            HandleCourseChangeEvent(args);
        }

        public void Handle(CourseIntroductionContentUpdated args)
        {
            HandleCourseChangeEvent(args);
        }

        public void Handle(CourseTemplateUpdatedEvent args)
        {
            HandleCourseChangeEvent(args);
        }

        public void Handle(CourseObjectivesReorderedEvent args)
        {
            HandleCourseChangeEvent(args);
        }

        public void Handle(CourseObjectiveRelatedEvent args)
        {
            HandleCourseChangeEvent(args);
        }

        public void Handle(CourseObjectivesUnrelatedEvent args)
        {
            HandleCourseChangeEvent(args);
        }

        public void Handle(CourseTemplateSettingsUpdated args)
        {
            HandleCourseChangeEvent(args);
        }

        private void HandleCourseChangeEvent(CourseEvent args)
        {
            _eventPublisher.Publish(new CourseChangedEvent(args.Course));
        }
    }
}
