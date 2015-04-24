using System;

namespace easygenerator.Infrastructure.Clonning
{
    public static class ReflectionExtensions
    {
        public static bool HasMethod(this Type type, string name, Type argumentType)
        {
            return type.GetMethod(name, new Type[] { argumentType }) != null;
        }

        public static bool ImplementsInterface(this Type type, Type interfaceType)
        {
            return type.GetInterface(interfaceType.Name) != null;
        }

        public static Type GetGenericInterfaceArgument(this Type type, Type interfaceType)
        {
            return type.GetInterface(interfaceType.Name).GetGenericArguments()[0];
        }

        public static Type GetObjectType(this object obj)
        {
            Type originalType = obj.GetType();
            return originalType.FullName.Contains("System.Data.Entity.DynamicProxies")
                ? originalType.BaseType
                : originalType;
        }
    }
}
