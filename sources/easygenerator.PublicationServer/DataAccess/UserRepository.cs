using System.Linq;
using Dapper;
using easygenerator.PublicationServer.Configuration;
using easygenerator.PublicationServer.Models;

namespace easygenerator.PublicationServer.DataAccess
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(ConfigurationReader configurationReader) : base(configurationReader)
        {
        }

        public void Add(User user)
        {
            ExecuteDbAction(
                connection => connection.Execute(
                    @"INSERT INTO Users (Email, AccessType, ModifiedOn) VALUES (@Email, @AccessType, @ModifiedOn)",
                    new { user.Email, user.AccessType, user.ModifiedOn })
            );
        }

        public User Get(string email)
        {
            return ExecuteDbAction(connection => connection.Query<User>(@"SELECT * FROM Users WHERE Email = @Email", new { Email = email }).SingleOrDefault());
        }

        public void Update(User user)
        {
            ExecuteDbAction(connection => connection.Execute(@"UPDATE Users SET AccessType = @AccessType, ModifiedOn = @ModifiedOn WHERE Email = @Email",
                new { user.AccessType, user.ModifiedOn, user.Email }));
        }
    }
}
