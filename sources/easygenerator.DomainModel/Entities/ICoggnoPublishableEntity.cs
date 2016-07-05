using System;

namespace easygenerator.DomainModel.Entities
{
    public interface ICoggnoPublishableEntity : IScormPublishableEntity
    {
        void MarkAsPublishedForSale();
    }
}
