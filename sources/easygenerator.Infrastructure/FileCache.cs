using System;
using System.Web;
using System.Web.Caching;

namespace easygenerator.Infrastructure
{
    public class FileCache
    {
        private readonly PhysicalFileManager _physicalFileManager;
        private Cache _cache { get { return HttpContext.Current.Cache; } }
        
        public FileCache(PhysicalFileManager physicalFileManager)
        {
            _physicalFileManager = physicalFileManager;
        }

        public virtual string ReadFromCacheOrLoad(string fileName)
        {
            var cahceItem = _cache[fileName];

            if (cahceItem != null)
            {
                return cahceItem.ToString();
            }
            else
            {
                var fileContent = _physicalFileManager.ReadAllFromFile(fileName);
                _cache.Insert(fileName, fileContent, null, Cache.NoAbsoluteExpiration, new TimeSpan(2, 0, 0));
                return fileContent;
            }
        }
    }
}
