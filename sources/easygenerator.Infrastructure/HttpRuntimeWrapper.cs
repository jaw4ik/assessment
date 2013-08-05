using System.Web;

namespace easygenerator.Infrastructure
{
    public class HttpRuntimeWrapper
    {
        public virtual string GetDomainAppPath()
        {
            return HttpRuntime.AppDomainAppPath;
        }
    }
}