using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface IUserLoginInfoRepository : IRepository<UserLoginInfo>
    {
        UserLoginInfo GetByEmail(string email);
    }
}
