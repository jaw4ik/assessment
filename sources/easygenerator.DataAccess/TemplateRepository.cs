using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.DataAccess
{
    public class TemplateRepository : ITemplateRepository
    {
        private readonly IDataContext _dataContext;

        public TemplateRepository(InMemoryDataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public Template Get(Guid id)
        {
            return _dataContext.Templates.SingleOrDefault(template => template.Id == id);
        }

        public ICollection<Template> GetCollection()
        {
            return _dataContext.Templates;
        }

        public void Add(Template entity)
        {
            throw new NotImplementedException();
        }

        public void Remove(Template entity)
        {
            throw new NotImplementedException();
        }
    }
}
