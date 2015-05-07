
namespace easygenerator.Infrastructure.Clonning
{
    public interface ICloner
    {
        T Clone<T>(T obj, params object[] args);
    }
}
