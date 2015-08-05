using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.BuildLearningPath
{
    public interface ILearningPathBuilder
    {
        bool Build(LearningPath learningPath);
    }
}
