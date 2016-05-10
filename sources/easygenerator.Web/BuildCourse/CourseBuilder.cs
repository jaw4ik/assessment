using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse.Modules;
using easygenerator.Web.BuildCourse.PublishSettings;
using easygenerator.Web.Storage;

namespace easygenerator.Web.BuildCourse
{
    public class CourseBuilder : CourseBuilderBase
    {
        private readonly IDomainEventPublisher _eventPublisher;

        public CourseBuilder(PhysicalFileManager fileManager,
            BuildPathProvider buildPathProvider,
            BuildPackageCreator buildPackageCreator,
            ICourseContentProvider buildContentProvider,
            PackageModulesProvider packageModulesProvider,
            PublishSettingsProvider publishSettingsProvider,
            ILog logger,
            IDomainEventPublisher eventPublisher)
            : base(fileManager,
                  buildPathProvider,
                  buildPackageCreator,
                  buildContentProvider,
                  packageModulesProvider,
                  publishSettingsProvider,
                  logger)
        {
            _eventPublisher = eventPublisher;
        }

        public override bool Build(Course course, bool includeMedia = false)
        {
            _eventPublisher.Publish(new CourseBuildStartedEvent(course));
            return base.Build(course, includeMedia);
        }

        protected override void OnAfterBuildPackageCreated(Course course, string buildId)
        {
            course.UpdatePackageUrl(buildId + ".zip");
        }
    }
}