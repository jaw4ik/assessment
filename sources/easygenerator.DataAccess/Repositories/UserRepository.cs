using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using System.Linq;

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
            return _dataContext.GetSet<User>().SingleOrDefault(user => user.Email == email);
        }
    }
}
