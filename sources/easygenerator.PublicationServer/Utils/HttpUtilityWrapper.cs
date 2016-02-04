using System.Web;

namespace easygenerator.PublicationServer.Utils
{
    public class HttpUtilityWrapper
    {
        public virtual string UrlEncode(string url)
        {
            return HttpUtility.UrlEncode(url);
        }

        public virtual string UrlDecode(string url)
        {
            return HttpUtility.UrlDecode(url);
        }
    }
}
