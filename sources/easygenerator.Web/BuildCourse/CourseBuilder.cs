using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.Web.BuildCourse
{
    public class CourseBuilder : CourseBuilderBase
    {
        public CourseBuilder(PhysicalFileManager fileManager, BuildPathProvider buildPathProvider, BuildPackageCreator buildPackageCreator, BuildContentProvider buildContentProvider, ILog logger)
            : base(fileManager, buildPathProvider, buildPackageCreator, buildContentProvider, logger)
        {

        }

        protected override void OnAfterBuildPackageCreated(Course course, string buildId)
        {
            course.UpdatePackageUrl(buildId + ".zip");
        }
    }
}