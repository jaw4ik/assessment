using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.BuildLearningPath
{
    public interface ILearningPathContentProvider
    {
        void AddContentToPackageDirectory(string buildDirectory, LearningPath learningPath);
    }
}
