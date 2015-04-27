using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace easygenerator.DomainModel.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        User GetUserByEmail(string email);
        ICollection<User> GetCollection(Expression<Func<User, bool>> predicate, int batchSize);
    }
}
