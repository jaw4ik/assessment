using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.BuildLearningPath
{
    public interface ILearningPathDocumentBuilder
    {
        void Build(string buildDirectory, Document document);
    }
}
