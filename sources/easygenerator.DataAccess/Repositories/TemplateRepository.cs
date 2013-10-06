using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class TemplateRepository : QuerableRepository<Template>, ITemplateRepository
    {
        public TemplateRepository(IDataContext dataContext)
            : base(dataContext)
        {

        }
    }
}
