using System;

namespace easygenerator.Infrastructure
{
    public interface ITypeMethodInvoker
    {
        object CallGenericTypeMethod(Type entityType, Type genericType, string methodName, object[] callParams);
    }
}
