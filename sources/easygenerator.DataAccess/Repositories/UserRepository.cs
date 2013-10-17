using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

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
            return _dataContext.GetSet<User>().SingleOrDefault(user => user.Email == email);
        }
    }
}
