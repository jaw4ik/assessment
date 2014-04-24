using System.Web;
using System.Web.Caching;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Import.PublishedCourse
{
    public class ImportContentReader
    {
        public ImportContentReader(PhysicalFileManager physicalFileManager)
        {
            _physicalFileManager = physicalFileManager;
        }

        private readonly PhysicalFileManager _physicalFileManager;

        private Cache _cache
        {
            get { return HttpRuntime.Cache; }
        }

        public virtual string ReadContent(string contentFilePath)
        {
            var cacheKey = "import:" + contentFilePath;

            var contentFormCache = _cache.Get(cacheKey);
            if (contentFormCache != null)
            {
                return contentFormCache.ToString();
            }

            var contentFromFileSystem = _physicalFileManager.ReadAllFromFile(contentFilePath);
            _cache.Insert(cacheKey, contentFromFileSystem);

            return contentFromFileSystem;
        }
    }
}