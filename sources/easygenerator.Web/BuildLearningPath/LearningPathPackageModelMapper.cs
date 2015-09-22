using easygenerator.DomainModel.Entities;
using easygenerator.Web.BuildLearningPath.PackageModel;
using easygenerator.Web.Extensions;
using System;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.Web.BuildLearningPath
{
    public class LearningPathPackageModelMapper
    {
        private LearningPathContentPathProvider _contentProvider;

        public LearningPathPackageModelMapper(LearningPathContentPathProvider contentProvider)
        {
            _contentProvider = contentProvider;
        }

        public virtual LearningPathPackageModel MapLearningPath(LearningPath learningPath)
        {
            if (learningPath == null)
            {
                throw new ArgumentNullException();
            }

            return new LearningPathPackageModel()
            {
                Id = learningPath.Id.ToNString(),
                CreatedOn = DateTimeWrapper.Now(),
                Title = learningPath.Title,
                Courses = (learningPath.Courses ?? new Collection<Course>()).Select(MapCourse).ToList()
            };
        }

        private LearningPathCoursePackageModel MapCourse(Course course)
        {
            return new LearningPathCoursePackageModel()
            {
                Title = course.Title,
                Link = _contentProvider.GetCourseLink(course.Id.ToNString())
            };
        }
    }
}