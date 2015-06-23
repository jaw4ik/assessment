using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse.Modules;

namespace easygenerator.Web.BuildCourse
{
    public class CourseBuilder : CourseBuilderBase
    {
        private readonly IDomainEventPublisher _eventPublisher;

        public CourseBuilder(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider, BuildPackageCreator buildPackageCreator,
            IBuildContentProvider buildContentProvider, PackageModulesProvider packageModulesProvider, ILog logger, IDomainEventPublisher eventPublisher)
            : base(fileManager, buildPathProvider, buildPackageCreator, buildContentProvider, packageModulesProvider, logger)
        {
            _eventPublisher = eventPublisher;
        }

        public override bool Build(Course course)
        {
            _eventPublisher.Publish(new CourseBuildStartedEvent(course));
            return base.Build(course);
        }

        protected override void OnAfterBuildPackageCreated(Course course, string buildId)
        {
            course.UpdatePackageUrl(buildId + ".zip");
        }
    }
}