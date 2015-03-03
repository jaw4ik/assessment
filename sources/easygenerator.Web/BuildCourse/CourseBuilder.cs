using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse.Modules;

namespace easygenerator.Web.BuildCourse
{
    public class CourseBuilder : CourseBuilderBase
    {
        public CourseBuilder(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider, BuildPackageCreator buildPackageCreator,
            BuildContentProvider buildContentProvider, PackageModulesProvider packageModulesProvider, ILog logger)
            : base(fileManager, buildPathProvider, buildPackageCreator, buildContentProvider, packageModulesProvider, logger) { }

        protected override void OnAfterBuildPackageCreated(Course course, string buildId)
        {
            course.UpdatePackageUrl(buildId + ".zip");
        }
    }
}