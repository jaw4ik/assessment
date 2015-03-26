using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;

namespace easygenerator.Web.DomainEvents.ChangeTracking
{
    public class CourseStateTracker :
        IDomainEventHandler<CourseChangedEvent>,
        IDomainEventHandler<CoursePublishedEvent>,
        IDomainEventHandler<CourseDeletedEvent>
    {
        private readonly ICourseStateStorage _courseStateStorage;

        public CourseStateTracker(ICourseStateStorage courseStateStorage)
        {
            _courseStateStorage = courseStateStorage;
        }

        public void Handle(CoursePublishedEvent args)
        {
            HandleCourseUnpublishedChangesState(args.Course, false);
        }

        public void Handle(CourseChangedEvent args)
        {
            HandleCourseUnpublishedChangesState(args.Course, true);
        }

        public void Handle(CourseDeletedEvent args)
        {
            _courseStateStorage.RemoveCourseState(args.Course);
        }

        private void HandleCourseUnpublishedChangesState(Course course, bool hasChanges)
        {
            var state = _courseStateStorage.GetCourseState(course);
            if (state.HasUnpublishedChanges == hasChanges)
                return;

            state.HasUnpublishedChanges = hasChanges;
            _courseStateStorage.SaveCourseState(state);
        }
    }
}
