using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using System.Linq.Expressions;

namespace easygenerator.DataAccess.Repositories
{
    public class QuerableRepository<T> : IQuerableRepository<T> where T : Identifiable
    {
        protected readonly IDataContext _dataContext;

        public QuerableRepository(IDataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public T Get(Guid id)
        {
            return _dataContext.GetSet<T>().SingleOrDefault(e => e.Id == id);
        }

        public ICollection<T> GetCollection()
        {
            return _dataContext.GetSet<T>().ToList();
        }

        public ICollection<T> GetCollection(Expression<Func<T, bool>> predicate)
        {
            return _dataContext.GetSet<T>().Where(predicate).ToList();
        }
    }
}
