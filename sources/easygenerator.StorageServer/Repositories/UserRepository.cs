using System.Linq;
using easygenerator.StorageServer.DataAccess;
using easygenerator.StorageServer.Infrastructure;
using easygenerator.StorageServer.Models.Entities;

namespace easygenerator.StorageServer.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public User GetOrAddUserByEmail(string email)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(email, "email");
            var user = _dataContext.GetSet<User>().SingleOrDefault(u => u.Email == email);
            if (user == null)
            {
                user = new User(email);
                Add(user);
            }
            return user;
        }
    }

    public interface IUserRepository : IRepository<User>
    {
        User GetOrAddUserByEmail(string email);
    }
}