using System.Collections.Specialized;

namespace easygenerator.PublicationServer.Extensions
{
    public static class NameValueCollectionExtensions
    {
        public static string GetValue(this NameValueCollection collection, string key)
        {
            var values = collection?.GetValues(key);
            if (values != null && values.Length > 0)
            {
                return values[0];
            }

            return null;
        }
    }
}
