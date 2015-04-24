using easygenerator.Infrastructure.DomainModel;
using easygenerator.Infrastructure.Http;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.DataAccess.Repositories
{
    public class HttpRequestsRepository : IHttpRequestsRepository
    {
        protected readonly DatabaseContext _dataContext;

        public HttpRequestsRepository(IDataContext dataContext)
        {
            _dataContext = (DatabaseContext)dataContext;
        }

        public void Add(HttpRequest entity)
        {
            _dataContext.Set<HttpRequest>().Add(entity);
        }

        public void Remove(HttpRequest entity)
        {
            _dataContext.Set<HttpRequest>().Remove(entity);
        }

        public ICollection<HttpRequest> GetCollection(int batchSize, int sendAttemptsLimit)
        {
            return _dataContext.Set<HttpRequest>().Where(_ => _.SendAttempts < sendAttemptsLimit).OrderBy(_ => _.CreatedOn).Take(batchSize).ToList();
        }
    }
}
