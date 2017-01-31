using easygenerator.PdfConverter.Converter;
using Quartz;
using System.IO;
using System.Web;

namespace easygenerator.PdfConverter.JobSheduler
{
    public class UpdateCacheJob : IJob
    {
        public void Execute(IJobExecutionContext context)
        {
            CacheManager.ClearCache();
        }
    }
}