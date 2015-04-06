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
        private readonly ICourseStateInfoStorage _storage;

        public CourseStateTracker(ICourseStateInfoStorage storage)
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
            _storage.RemoveCourseStateInfo(args.Course);
        }

        private void HandleCourseUnpublishedChangesState(Course course, bool hasChanges)
        {
            if (string.IsNullOrEmpty(course.PublicationUrl))
                return;

            var info = _storage.GetCourseStateInfo(course);
            if (info.HasUnpublishedChanges == hasChanges)
                return;

            info.HasUnpublishedChanges = hasChanges;
            _storage.SaveCourseStateInfo(course, info);
        }
    }
}
