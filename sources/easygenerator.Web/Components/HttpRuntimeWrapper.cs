using System.Web;

namespace easygenerator.Web.Components
{
    public class HttpRuntimeWrapper
    {
        public virtual string GetDomainAppPath()
        {
            return HttpRuntime.AppDomainAppPath;
        }
    }
}