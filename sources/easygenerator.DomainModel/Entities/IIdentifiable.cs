using System;

namespace easygenerator.DomainModel.Entities
{
    public interface IIdentifiable
    {
        Guid Id { get; }
    }
}
