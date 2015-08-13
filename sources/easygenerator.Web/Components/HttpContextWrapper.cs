using System.Web;

namespace easygenerator.Web.Components
{
    public class HttpContextWrapper
    {
        public virtual HttpContext Current
        {
            get { return HttpContext.Current; }
        }
    }
}