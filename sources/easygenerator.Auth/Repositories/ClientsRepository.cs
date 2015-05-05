using System.Collections.Generic;
using easygenerator.Auth.Models;
using easygenerator.Auth.Providers;

namespace easygenerator.Auth.Repositories
{
    public class ClientsRepository : IClientsRepository
    {

        public ICollection<ClientModel> GetCollection()
        {
            return AuthorizationConfigurationProvider.Clients;
        }
    }

    public interface IClientsRepository
    {
        ICollection<ClientModel> GetCollection();
    }
}
