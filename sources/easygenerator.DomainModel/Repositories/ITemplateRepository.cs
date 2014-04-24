using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface ITemplateRepository : IQuerableRepository<Template>
    {
        Template GetDefaultTemplate();
    }
}
