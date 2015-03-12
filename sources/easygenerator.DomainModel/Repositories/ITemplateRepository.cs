using easygenerator.DomainModel.Entities;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Repositories
{
    public interface ITemplateRepository : IQuerableRepository<Template>
    {
        Template GetDefaultTemplate();
        ICollection<Template> GetCollection(string userName);
    }
}
