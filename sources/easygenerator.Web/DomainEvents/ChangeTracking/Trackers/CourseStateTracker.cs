using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.DomainEvents.ChangeTracking.Events;
using easygenerator.Web.InMemoryStorages.CourseStateStorage;
using easygenerator.Web.Storage;

namespace easygenerator.Web.DomainEvents.ChangeTracking.Trackers
{
    public class CourseStateTracker :
        IDomainEventHandler<CourseChangedEvent>,
        IDomainEventHandler<CoursePublishedEvent>,
        IDomainEventHandler<CourseDeletedEvent>,
        IDomainEventHandler<CourseBuildStartedEvent>
    {
        private readonly ICourseStateStorage _stateStorage;
        private readonly IDomainEventPublisher _eventPublisher;
        private readonly ICourseInfoInMemoryStorage _infoStorage;

        public CourseStateTracker(ICourseStateStorage stateStorage, IDomainEventPublisher eventPublisher, ICourseInfoInMemoryStorage infoStorage)
        {
            _stateStorage = stateStorage;
            _eventPublisher = eventPublisher;
            _infoStorage = infoStorage;
        }

        public void Handle(CourseChangedEvent args)
        {
            var info = _infoStorage.GetCourseInfoOrDefault(args.Course);
            info.ChangedOn = DateTimeWrapper.Now();
            _infoStorage.SaveCourseInfo(args.Course, info);

            if (_stateStorage.HasUnpublishedChanges(args.Course))
                return;

            _eventPublisher.Publish(new CourseStateChangedEvent(args.Course, true));
            _stateStorage.SaveHasUnpublishedChanges(args.Course, true);
        }

        public void Handle(CourseBuildStartedEvent args)
        {
            var info = _infoStorage.GetCourseInfoOrDefault(args.Course);
            info.BuildStartedOn = DateTimeWrapper.Now();
            _infoStorage.SaveCourseInfo(args.Course, info);
        }

        public void Handle(CoursePublishedEvent args)
        {
            if (!_stateStorage.HasUnpublishedChanges(args.Course))
                return;

            if (!IsPublishSuccessful(args.Course))
                return;

            var info = _infoStorage.GetCourseInfoOrDefault(args.Course);
            if (info.ChangedOn > info.BuildStartedOn)
                return;

            _eventPublisher.Publish(new CourseStateChangedEvent(args.Course, false));
            _stateStorage.SaveHasUnpublishedChanges(args.Course, false);
        }

        public void Handle(CourseDeletedEvent args)
        {
            _infoStorage.RemoveCourseInfo(args.Course);
            _stateStorage.RemoveCourseState(args.Course);
        }

        private bool IsPublishSuccessful(Course course)
        {
            return !string.IsNullOrEmpty(course.PublicationUrl);
        }

    }
}
