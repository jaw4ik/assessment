using System;

namespace easygenerator.DomainModel.Entities
{
    public interface IScormPublishableEntity : IPublishableEntity
    {
        string ScormPackageUrl { get; }
    }
}
