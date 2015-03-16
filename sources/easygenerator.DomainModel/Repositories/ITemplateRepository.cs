using easygenerator.DomainModel.Entities;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Repositories
{
    public interface ITemplateRepository : IQuerableRepository<Template>
    {
        Template GetDefaultTemplate();
        Template GetByName(string templateName, string userName);
        ICollection<Template> GetCollection(string userName);
    }
}
