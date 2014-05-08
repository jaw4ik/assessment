using System;
using System.Reflection;

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
    }
}