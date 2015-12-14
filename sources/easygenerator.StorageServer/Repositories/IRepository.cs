using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using easygenerator.StorageServer.Models.Entities;

namespace easygenerator.StorageServer.Repositories
{
    public interface IRepository<T> where T : Entity
    {
        void Add(T entity);
        void Remove(T entity);

        T Get(Guid id);

        ICollection<T> GetCollection();
        ICollection<T> GetCollection(Expression<Func<T, bool>> predicate);
    }
}