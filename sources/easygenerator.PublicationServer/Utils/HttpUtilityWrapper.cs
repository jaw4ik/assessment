using System.Web;

namespace easygenerator.PublicationServer.Utils
{
    public class HttpUtilityWrapper
    {
        public virtual string UrlEncode(string url)
        {
            return HttpUtility.UrlEncode(url);
        }
    }
}
