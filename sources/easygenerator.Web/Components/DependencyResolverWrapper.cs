using easygenerator.Infrastructure;
using System.Web.Mvc;

namespace easygenerator.Web.Components
{
    public class DependencyResolverWrapper : IDependencyResolverWrapper
    {
        public T GetService<T>()
        {
            return DependencyResolver.Current.GetService<T>();
        }
    }
}