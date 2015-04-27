namespace easygenerator.Infrastructure.Http
{
    public interface IHttpRequestsManager
    {
        void PostOrAddToQueueIfUnexpectedError(string url, object postJsonData, string serviceName,
            bool reportOnFailure = true);
    }
}