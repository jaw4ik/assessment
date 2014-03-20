using easygenerator.Infrastructure.DomainModel;

namespace easygenerator.Infrastructure.Http
{
    public class HttpRequestsManager : IHttpRequestsManager
    {
        private readonly IHttpRequestsRepository _httpRequestsRepository;
        private readonly IUnitOfWork _unitOfWork;

        public HttpRequestsManager(IHttpRequestsRepository httpRequestsRepository, IUnitOfWork unitOfWork)
        {
            _httpRequestsRepository = httpRequestsRepository;
            _unitOfWork = unitOfWork;
        }

        public void AddHttpRequestToQueue(string url, string verb, string postJsonData, string serviceName, bool reportOnFailure = true)
        {
            _httpRequestsRepository.Add(new HttpRequest(url, verb, postJsonData, serviceName, reportOnFailure));
            _unitOfWork.Save();
        }
    }
}