using System;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;

namespace easygenerator.Web.Extensions
{
    public static class Extensions
    {
        public static string ToNString(this Guid value)
        {
            return value.ToString("N");
        }

        public static bool HasCustomAttribute(this ICustomAttributeProvider attrProvider, Type attributeType, bool inherit = true)
        {
            return attrProvider.GetCustomAttributes(attributeType, inherit).Length > 0;
        }


        public static Guid? GetGuidValue(this IValueProvider valueProvider, string key)
        {
            ValueProviderResult id = valueProvider.GetValue(key);

            if (id == null)
                return null;

            Guid entityId;

            if (!Guid.TryParse(id.AttemptedValue, out entityId))
                return null;

            return entityId;
        }

        public static bool IsGenericTypeAssignableFrom(this Type genericType, Type givenType)
        {
            var interfaceTypes = givenType.GetInterfaces();

            if (interfaceTypes.Any(it => it.IsGenericType && it.GetGenericTypeDefinition() == genericType))
                return true;

            var baseType = givenType.BaseType;
            if (baseType == null) return false;

            return baseType.IsGenericType &&
                   baseType.GetGenericTypeDefinition() == genericType ||
                   IsGenericTypeAssignableFrom(genericType, baseType);
        }
    }
}