namespace easygenerator.Infrastructure
{
    public interface IDictionaryStorage
    {
        void Add(string key, object value);

        T Get<T>(string key) where T : class;

        void Remove(string key);
    }
}
