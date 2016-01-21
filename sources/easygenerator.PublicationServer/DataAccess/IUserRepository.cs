using easygenerator.PublicationServer.Models;

namespace easygenerator.PublicationServer.DataAccess
{
    public interface IUserRepository
    {
        User Get(string email);
        void Add(User user);
        void Update(User user);
    }
}
