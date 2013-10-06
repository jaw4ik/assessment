﻿using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class QuerableRepository<T> : IQuerableRepository<T> where T : Entity
    {
        private readonly IDataContext _dataContext;

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
    }
}
