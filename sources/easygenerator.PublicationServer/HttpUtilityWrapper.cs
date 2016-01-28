using System.Web;

namespace easygenerator.PublicationServer
{
    public class HttpUtilityWrapper
    {
        public virtual string UrlEncode(string url)
        {
            return HttpUtility.UrlEncode(url);
        }
    }
}
