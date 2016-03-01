using easygenerator.DomainModel.Entities;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Repositories
{
    public interface ISectionRepository : IRepository<Section>
    {
        ICollection<Section> GetAvailableSectionsCollection(string username);
    }
}
