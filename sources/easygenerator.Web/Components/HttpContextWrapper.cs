using System.Web;

namespace easygenerator.Web.Components
{
    public class HttpContextWrapper
    {
        public virtual string GetCurrentScheme()
        {
            return HttpContext.Current.Request.Url.Scheme;
        }
    }
}