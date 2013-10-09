using System.Web;

namespace easygenerator.Web.BuildExperience
{
    public class HttpRuntimeWrapper
    {
        public virtual string GetDomainAppPath()
        {
            return HttpRuntime.AppDomainAppPath;
        }

        public virtual string GetAppDomain()
        {
            return HttpRuntime.AppDomainAppVirtualPath;
        }
    }
}