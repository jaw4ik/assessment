using System.Collections.Generic;
using System.IO;

namespace easygenerator.PdfConverter.Converter
{
    public static class CacheManager
    {
        private static Dictionary<string, string> _cache;

        static CacheManager()
        {
            _cache = new Dictionary<string, string>();
        }

        public static string Get(string url, string version, bool quality)
        {
            if (version == null)
            {
                return null;
            }

            var key = CombineKey(url, version, quality);
            var filePath = _cache.ContainsKey(key) ? _cache[key] : null;

            if (!File.Exists(filePath))
            {
                _cache.Remove(key);
                return null;
            }

            return filePath;
        }

        public static void Set(string url, string version, bool quality, string value)
        {
            if (version == null)
            {
                return;
            }

            var key = CombineKey(url, version, quality);
            if (_cache.ContainsKey(key))
            {
                _cache[key] = value;
            }
            else
            {
                _cache.Add(key, value);
            }
        }

        private static string CombineKey(string url, string version, bool high_quality)
        {
            return $"{url}_{version}_{high_quality}";
        }
    }
}