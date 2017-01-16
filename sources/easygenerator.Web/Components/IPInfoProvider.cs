using System.Web;

namespace easygenerator.Web.Components
{
    public interface IIPInfoProvider
    {
        string GetIP(HttpContextBase context);
    }

    public class IPInfoProvider : IIPInfoProvider
    {
        public string GetIP(HttpContextBase context)
        {
            var ipAddress = context.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (!string.IsNullOrEmpty(ipAddress))
            {
                var addresses = ipAddress.Split(',');
                if (addresses.Length != 0)
                {
                    return addresses[0];
                }
            }

            return context.Request.ServerVariables["REMOTE_ADDR"];
        }
    }
}