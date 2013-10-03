using System;
using System.Collections.Generic;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface IRepository<T> : IQuerableRepository<T> where T : Entity
    {
        void Add(T entity);
        void Remove(T entity);
    }
}
