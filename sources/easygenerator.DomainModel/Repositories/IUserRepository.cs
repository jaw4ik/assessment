using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.DomainModel.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        User GetUserByEmail(string email);
        ICollection<User> GetCollection(Expression<Func<User, bool>> predicate, int batchSize);
    }
}
