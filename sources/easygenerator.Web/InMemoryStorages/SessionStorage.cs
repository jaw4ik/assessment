using System.Web;
using easygenerator.Infrastructure;

namespace easygenerator.Web.InMemoryStorages
{
    public class SessionStorage : IDictionaryStorage
    {
        private readonly HttpContextWrapper _httpContext;

        public SessionStorage(HttpContextWrapper httpContext)
        {
            _httpContext = httpContext;
        }
        public void Add(string key, object value)
        {
            _httpContext.Session[key] = value;
        }

        public T Get<T>(string key) where T : class
        {
            return _httpContext.Session[key] as T;
        }

        public void Remove(string key)
        {
            _httpContext.Session.Remove(key);
        }
    }
}