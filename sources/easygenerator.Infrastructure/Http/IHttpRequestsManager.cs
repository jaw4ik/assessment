namespace easygenerator.Infrastructure.Http
{
    public interface IHttpRequestsManager
    {
        void AddHttpRequestToQueue(string url, string verb, string postJsonData, string serviceName, bool reportOnFailure = true);
    }
}