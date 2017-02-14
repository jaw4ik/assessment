using easygenerator.PdfConverter.Components.Configuration;
using easygenerator.PdfConverter.Controllers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;

namespace easygenerator.PdfConverter.Converter
{
    public static class CacheManager
    {
        public const string TEMP_FILES_LOCATION_DIRECTORY = "Pdf_Download";
        private static Dictionary<string, string> _cache;
        private readonly static TimeSpan _maxCacheLifeTime;
        public readonly static string directoryPath;
        public static long currentCacheSize;

        static CacheManager()
        {
            _cache = new Dictionary<string, string>();
            _maxCacheLifeTime = new TimeSpan((ConfigurationManager.GetSection("jobShedulerTime") as JobShedulerTimeConfigurationSection).MaxCacheLifeTimeInDays, 0, 0, 0, 0);
            currentCacheSize = 0;
            directoryPath = Path.Combine(HttpRuntime.AppDomainAppPath, TEMP_FILES_LOCATION_DIRECTORY);

            DeleteAllFiles();
        }

        private static void DeleteAllFiles()
        {            
            if (Directory.Exists(directoryPath))
            {
                foreach (var filePath in Directory.GetFiles(directoryPath, "*.pdf", SearchOption.AllDirectories))
                {
                    File.Delete(filePath);
                }
            }
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

        public static void ClearCache()
        {
            foreach (var file in _cache.ToDictionary(entry=>entry.Key, entry=>entry.Value))
            {
                var timeDifference = DateTime.UtcNow - File.GetLastAccessTimeUtc(file.Value);
                if (timeDifference >= _maxCacheLifeTime)
                {
                    currentCacheSize -= new FileInfo(file.Value).Length;
                    File.Delete(file.Value);
                    _cache.Remove(file.Key);
                }
            }
        }

        private static string CombineKey(string url, string version, bool quality)
        {
            return $"{url}_{version}_{quality}";
        }
    }
}