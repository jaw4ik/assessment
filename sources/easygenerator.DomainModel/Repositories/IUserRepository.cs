using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface IUserRepository : IRepository<User>
    {
        User GetUserByEmail(string email);
    }
}
