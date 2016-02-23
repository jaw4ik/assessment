namespace easygenerator.Infrastructure.Serialization.Providers
{
    public interface ISerializationProvider<T>
    {
        string Serialize(T data);
        T Deserialize(string data);
    }
}