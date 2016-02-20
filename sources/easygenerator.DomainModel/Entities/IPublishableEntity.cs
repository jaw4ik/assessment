using System;

namespace easygenerator.DomainModel.Entities
{
    public interface IPublishableEntity : IIdentifieble
    {
        string PackageUrl { get; }
        string CreatedBy { get; }
        string Title { get; }
        DateTime CreatedOn { get; }
        void UpdatePublicationUrl(string publicationUrl);
        void ResetPublicationUrl();
    }
}
