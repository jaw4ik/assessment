using System.Linq;
using easygenerator.DomainModel.Entities;
using System;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.BuildLearningPath
{
    public class LearningPathBuilder : ILearningPathBuilder
    {
        private ICourseBuilder _courseBuilder;

        public LearningPathBuilder(ICourseBuilder courseBuilder)
        {
            _courseBuilder = courseBuilder;
        }

        public BuildResult Build(LearningPath learningPath)
        {
            try
            {
                var course = learningPath.Courses.First();

                var result = _courseBuilder.Build(course);

                return new BuildResult(result, course.PackageUrl);
            }
            catch (Exception)
            {
                return new BuildResult(false, String.Empty);
            }
            
        }
    }
}