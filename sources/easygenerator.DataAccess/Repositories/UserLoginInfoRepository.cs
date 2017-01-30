using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Users;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class UserLoginInfoRepository : Repository<UserLoginInfo>, IUserLoginInfoRepository
    {
        public UserLoginInfoRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public UserLoginInfo GetByEmail(string email)
        {
            return _dataContext.GetSet<UserLoginInfo>().FirstOrDefault(info => info.Email == email);
        }
    }
}
