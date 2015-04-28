using System;
using System.Web.Http.Dependencies;

namespace easygenerator.PublicationServer.Extensions
{
    public static class DependencyResolverExtensions
    {
        public static T GetService<T> (this IDependencyResolver resolver) 
            where T : class
        {
            return resolver.GetService(typeof(T)) as T;
        }
    }
}
