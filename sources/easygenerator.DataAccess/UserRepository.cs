using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess
{
    public class UserRepository : IUserRepository
    {
        private readonly IDataContext _dataContext;

        public UserRepository(InMemoryDataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public User Get(Guid id)
        {
            return _dataContext.Users.SingleOrDefault(user => user.Id == id);
        }

        public ICollection<User> GetCollection()
        {
            return _dataContext.Users;
        }

        public void Add(User entity)
        {
            _dataContext.Users.Add(entity);
        }

        public void Remove(User entity)
        {
            throw new NotImplementedException();
        }

        public User GetUserByEmail(string email)
        {
            return _dataContext.Users.SingleOrDefault(user => user.Email == email);
        }
    }
}
