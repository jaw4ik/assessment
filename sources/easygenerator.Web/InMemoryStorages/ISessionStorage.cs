namespace easygenerator.Web.InMemoryStorages
{
    public interface ISessionStorage
    {
        void Add(string key, object value);

        T Get<T>(string key) where T : class;

        void Remove(string key);
    }
}
