using System;
using System.Collections.Generic;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface IRepository<T> : IQuerableRepository<T> where T : Identifiable
    {
        void Add(T entity);
        void Remove(T entity);
    }
}
