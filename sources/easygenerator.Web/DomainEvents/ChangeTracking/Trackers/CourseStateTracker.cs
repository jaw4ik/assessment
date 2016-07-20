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
        IDomainEventHandler<CoursePublishedForSaleEvent>,
        IDomainEventHandler<CourseDeletedEvent>,
        IDomainEventHandler<CourseBuildStartedEvent>,
        IDomainEventHandler<CourseScormBuildStartedEvent>,
        IDomainEventHandler<CourseProcessedByCoggnoEvent>
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
            if (!HasPublicationPackage(args.Course) && !HasPublicationForSalePackage(args.Course))
                return;

            var info = _infoStorage.GetCourseInfoOrDefault(args.Course);
            info.ChangedOn = DateTimeWrapper.Now();
            _infoStorage.SaveCourseInfo(args.Course, info);

            if (_stateStorage.IsDirty(args.Course) && _stateStorage.IsDirtyForSale(args.Course))
                return;

            _eventPublisher.Publish(new CourseStateChangedEvent(args.Course, true, true));
            _stateStorage.MarkAsDirty(args.Course);
        }

        public void Handle(CourseBuildStartedEvent args)
        {
            var info = _infoStorage.GetCourseInfoOrDefault(args.Course);
            info.BuildStartedOn = DateTimeWrapper.Now();
            _infoStorage.SaveCourseInfo(args.Course, info);
        }

        public void Handle(CourseScormBuildStartedEvent args)
        {
            var info = _infoStorage.GetCourseInfoOrDefault(args.Course);
            info.BuildForSaleStartedOn = DateTimeWrapper.Now();
            _infoStorage.SaveCourseInfo(args.Course, info);
        }

        public void Handle(CoursePublishedEvent args)
        {
            if (!_stateStorage.IsDirty(args.Course))
                return;

            var info = _infoStorage.GetCourseInfoOrDefault(args.Course);
            if (HasPublicationPackage(args.Course) && info.ChangedOn > info.BuildStartedOn)
                return;

            _eventPublisher.Publish(new CourseStateChangedEvent(args.Course, false, info.IsDirtyForSale));
            _stateStorage.MarkAsClean(args.Course);
        }

        public void Handle(CoursePublishedForSaleEvent args)
        {
            if (!_stateStorage.IsDirtyForSale(args.Course))
                return;

            var info = _infoStorage.GetCourseInfoOrDefault(args.Course);
            if (HasPublicationForSalePackage(args.Course) && info.ChangedOn > info.BuildForSaleStartedOn)
                return;

            _eventPublisher.Publish(new CourseStateChangedEvent(args.Course, info.IsDirty, false));
            _stateStorage.MarkAsCleanForSale(args.Course);
        }

        public void Handle(CourseProcessedByCoggnoEvent args)
        {
            if (args.Success)
                return;
            if (_stateStorage.IsDirtyForSale(args.Course))
                return;

            var info = _infoStorage.GetCourseInfoOrDefault(args.Course);
            _eventPublisher.Publish(new CourseStateChangedEvent(args.Course, info.IsDirty, true));

            var isDirty = info.IsDirty;
            _stateStorage.MarkAsDirty(args.Course);
            if (!isDirty)
            {
                _stateStorage.MarkAsClean(args.Course);
            }
        }

        public void Handle(CourseDeletedEvent args)
        {
            _infoStorage.RemoveCourseInfo(args.Course);
            _stateStorage.RemoveState(args.Course);
        }

        private static bool HasPublicationPackage(Course course)
        {
            return !string.IsNullOrEmpty(course.PublicationUrl);
        }

        private static bool HasPublicationForSalePackage(Course course)
        {
            return !string.IsNullOrEmpty(course.SaleInfo.DocumentId) || course.SaleInfo.IsProcessing;
        }

    }
}
