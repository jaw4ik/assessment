using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class TemplateRepository : QuerableRepository<Template>, ITemplateRepository
    {
        private const string DefaultTemplateName = "Simple course";

        public TemplateRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public Template GetDefaultTemplate()
        {
            return GetCollection(template => template.Name == DefaultTemplateName).ElementAt(0);
        }
    }
}
