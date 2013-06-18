using System;
using System.Collections.Generic;
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface IRepository<T> where T : Entity
    {
        T Get(Guid id);

        ICollection<T> GetCollection();

        void Add(T entity);
        void Remove(T entity);
    }
}
