using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.DomainModel.Repositories
{
    public interface IUserLoginInfoRepository : IRepository<UserLoginInfo>
    {
        UserLoginInfo GetByEmail(string email);
    }
}
