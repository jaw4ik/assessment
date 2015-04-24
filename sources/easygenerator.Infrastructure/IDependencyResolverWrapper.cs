
namespace easygenerator.Infrastructure
{
    public interface IDependencyResolverWrapper
    {
        T GetService<T>();
    }
}
