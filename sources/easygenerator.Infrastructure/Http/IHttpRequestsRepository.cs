using easygenerator.Infrastructure.DomainModel;
using System.Collections.Generic;

namespace easygenerator.Infrastructure.Http
{
    public interface IHttpRequestsRepository
    {
        ICollection<HttpRequest> GetCollection(int batchSize, int sendAttemptsLimit);
        void Add(HttpRequest entity);
        void Remove(HttpRequest entity);
    }
}
