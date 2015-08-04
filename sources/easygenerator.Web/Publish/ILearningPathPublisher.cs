using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Publish
{
    public interface ILearningPathPublisher
    {
        bool Publish(LearningPath learningPath);
    }
}
