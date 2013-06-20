using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.Web.Repositories
{
    public class Repository<T> : IRepository<T> where T : Entity
    {
        private readonly List<T> _context;

        public Repository()
        {
            _context = new List<T>();
        }

        public T Get(Guid id)
        {
            return _context.SingleOrDefault(e => e.Id == id);
        }

        public ICollection<T> GetCollection()
        {
            return _context.ToList();
        }

        public void Add(T entity)
        {
            _context.Add(entity);
        }

        public void Remove(T entity)
        {
            _context.Remove(entity);
        }
    }
}