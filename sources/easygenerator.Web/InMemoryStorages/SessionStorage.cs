using System.Web;
using easygenerator.Infrastructure;

namespace easygenerator.Web.InMemoryStorages
{
    public class SessionStorage : IDictionaryStorage
    {
        private readonly Components.HttpContextWrapper _httpContext;

        public SessionStorage(Components.HttpContextWrapper httpContext)
        {
            _httpContext = httpContext;
        }
        public void Add(string key, object value)
        {
            _httpContext.Current.Session[key] = value;
        }

        public T Get<T>(string key) where T : class
        {
            return _httpContext.Current.Session[key] as T;
        }

        public void Remove(string key)
        {
            _httpContext.Current.Session.Remove(key);
        }
    }
}