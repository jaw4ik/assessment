using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.BuildLearningPath
{
    public interface ILearningPathBuilder
    {
        BuildResult Build(LearningPath learningPath);
    }
}
