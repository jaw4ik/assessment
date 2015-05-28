using System.Collections.Generic;
using easygenerator.Auth.Models;
using easygenerator.Auth.Providers;

namespace easygenerator.Auth.Repositories
{
    public class EndpointsRepository : IEndpointsRepository
    {
        public ICollection<EndpointModel> GetCollection()
        {
            return AuthorizationConfigurationProvider.Endpoints;
        }
    }

    public interface IEndpointsRepository
    {
        ICollection<EndpointModel> GetCollection();
    }
}
