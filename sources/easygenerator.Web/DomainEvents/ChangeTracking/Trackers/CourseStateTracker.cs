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
            if (!HasPublicationPackage(args.Course))
                return;

            var info = _infoStorage.GetCourseInfoOrDefault(args.Course);
            info.ChangedOn = DateTimeWrapper.Now();
            _infoStorage.SaveCourseInfo(args.Course, info);

            if (_stateStorage.IsDirty(args.Course))
                return;

            _eventPublisher.Publish(new CourseStateChangedEvent(args.Course, true));
            _stateStorage.MarkAsDirty(args.Course);
        }

        public void Handle(CourseBuildStartedEvent args)
        {
            var info = _infoStorage.GetCourseInfoOrDefault(args.Course);
            info.BuildStartedOn = DateTimeWrapper.Now();
            _infoStorage.SaveCourseInfo(args.Course, info);
        }

        public void Handle(CoursePublishedEvent args)
        {
            if (!_stateStorage.IsDirty(args.Course))
                return;

            var info = _infoStorage.GetCourseInfoOrDefault(args.Course);
            if (HasPublicationPackage(args.Course) && info.ChangedOn > info.BuildStartedOn)
                return;

            _eventPublisher.Publish(new CourseStateChangedEvent(args.Course, false));
            _stateStorage.MarkAsClean(args.Course);
        }

        public void Handle(CourseDeletedEvent args)
        {
            _infoStorage.RemoveCourseInfo(args.Course);
            _stateStorage.RemoveState(args.Course);
        }

        private bool HasPublicationPackage(Course course)
        {
            return !string.IsNullOrEmpty(course.PublicationUrl);
        }

    }
}
