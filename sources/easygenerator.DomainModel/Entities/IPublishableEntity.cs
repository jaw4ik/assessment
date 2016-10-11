using System;

namespace easygenerator.DomainModel.Entities
{
    public interface IPublishableEntity : IIdentifiable
    {
        string PackageUrl { get; }
        string CreatedBy { get; }
        string Title { get; }
        DateTime CreatedOn { get; }
        string PublicationUrl { get; }
        void UpdatePublicationUrl(string publicationUrl);
        void ResetPublicationUrl();
        void SetPublishedToExternalLms(Company company);
    }
}
