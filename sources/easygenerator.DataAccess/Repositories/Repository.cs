using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class Repository<T> : QuerableRepository<T>, IRepository<T> where T : Entity
    {
        private readonly IDataContext _dataContext;

        public Repository(IDataContext dataContext)
            : base(dataContext)
        {
            _dataContext = dataContext;
        }

        public void Add(T entity)
        {
            _dataContext.GetSet<T>().Add(entity);
        }

        public void Remove(T entity)
        {
            _dataContext.GetSet<T>().Remove(entity);
        }
    }
}
