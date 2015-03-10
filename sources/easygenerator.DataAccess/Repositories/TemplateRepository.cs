using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.ACL;
using easygenerator.DomainModel.Repositories;
using System.Collections.Generic;

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

        public ICollection<Template> GetCollection(string userName)
        {
            return GetCollection(t => t.AccessControlList.Any(templateAcl => templateAcl.UserIdentity == userName || templateAcl.UserIdentity == AccessControlListEntry.WildcardIdentity));
        }
    }
}
