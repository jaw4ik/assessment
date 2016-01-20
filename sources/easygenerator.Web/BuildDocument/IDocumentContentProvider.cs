using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.BuildDocument
{
    public interface IDocumentContentProvider
    {
        void AddBuildContentToPackageDirectory(string buildDirectory, Document course);
    }
}
