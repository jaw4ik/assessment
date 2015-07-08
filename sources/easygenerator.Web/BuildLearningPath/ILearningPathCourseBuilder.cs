using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.BuildLearningPath
{
    public interface ILearningPathCourseBuilder
    {
        void Build(string buildDirectory, Course course);
    }
}
