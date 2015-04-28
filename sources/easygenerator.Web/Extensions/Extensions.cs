using System;
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
    }
}