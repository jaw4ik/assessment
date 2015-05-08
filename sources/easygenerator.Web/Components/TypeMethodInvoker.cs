using System;
using System.Web.Mvc;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Components
{
    public class TypeMethodInvoker: ITypeMethodInvoker
    {
        public object CallGenericTypeMethod(Type entityType, Type genericType, string methodName, object[] callParams)
        {
            var serviceType = genericType.MakeGenericType(entityType);
            var service = DependencyResolver.Current.GetService(serviceType);
            var method = serviceType.GetMethod(methodName);
            return method.Invoke(service, callParams);
        }
    }
}