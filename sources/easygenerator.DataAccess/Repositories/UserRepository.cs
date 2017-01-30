﻿using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.DataAccess.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public User GetUserByEmail(string email)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(email, "email");
            return _dataContext.GetSet<User>().Include(e => e.LtiUserInfoes).Include(e => e.SamlIdPUserInfoes).SingleOrDefault(user => user.Email == email);
        }

        public ICollection<User> GetCollection(Expression<Func<User, bool>> predicate, int batchSize)
        {
            return _dataContext.GetSet<User>().Include(e => e.LtiUserInfoes).Include(e => e.SamlIdPUserInfoes).Where(predicate).Take(batchSize).ToList();
        }
    }
}
