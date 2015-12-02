using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using easygenerator.StorageServer.DataAccess;
using easygenerator.StorageServer.Models.Entities;

namespace easygenerator.StorageServer.Repositories
{
    public class Repository<T> : IRepository<T> where T : Entity
    {
        protected readonly IDataContext _dataContext;

        public Repository(IDataContext dataContext)
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