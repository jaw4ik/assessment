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
        private readonly ICourseStateStorage _storage;

        public CourseStateTracker(ICourseStateStorage storage)
        {
            _storage = storage;
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
            _storage.RemoveCourseState(args.Course);
        }

        private void HandleCourseUnpublishedChangesState(Course course, bool hasChanges)
        {
            var state = _storage.GetCourseState(course);
            if (state.HasUnpublishedChanges == hasChanges)
                return;

            state.HasUnpublishedChanges = hasChanges;
            _storage.SaveCourseState(state);
        }
    }
}
