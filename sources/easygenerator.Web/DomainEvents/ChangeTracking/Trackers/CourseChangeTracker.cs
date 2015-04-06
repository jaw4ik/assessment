using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using System.Collections.Generic;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Trackers
{
    public class CourseChangeTracker :
        IDomainEventHandler<CourseTitleUpdatedEvent>,
        IDomainEventHandler<CourseIntroductionContentUpdated>,
        IDomainEventHandler<CourseTemplateUpdatedEvent>,
        IDomainEventHandler<CourseObjectivesReorderedEvent>,
        IDomainEventHandler<CourseObjectiveRelatedEvent>,
        IDomainEventHandler<CourseObjectivesUnrelatedEvent>,
        IDomainEventHandler<CourseTemplateSettingsUpdated>,
        IDomainEventHandler<ObjectiveChangedEvent>,
        IDomainEventHandler<QuestionChangedEvent>
    {
        private readonly ICourseRepository _repository;
        private readonly IDomainEventPublisher _eventPublisher;

        public CourseChangeTracker(IDomainEventPublisher eventPublisher, ICourseRepository repository)
        {
            _eventPublisher = eventPublisher;
            _repository = repository;
        }

        #region Course event handlers

        public void Handle(CourseTitleUpdatedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseIntroductionContentUpdated args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseTemplateUpdatedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseObjectivesReorderedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseObjectiveRelatedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseObjectivesUnrelatedEvent args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        public void Handle(CourseTemplateSettingsUpdated args)
        {
            RaiseCourseChangedEvent(args.Course);
        }

        #endregion

        public void Handle(ObjectiveChangedEvent args)
        {
            RaiseCoursesChangedEvent(_repository.GetObjectiveCourses(args.Objective.Id));
        }

        public void Handle(QuestionChangedEvent args)
        {

        }

        private void RaiseCoursesChangedEvent(IEnumerable<Course> courses)
        {
            foreach (var course in courses)
            {
                RaiseCourseChangedEvent(course);
            }
        }

        private void RaiseCourseChangedEvent(Course course)
        {
            _eventPublisher.Publish(new CourseChangedEvent(course));
        }

    }
}
