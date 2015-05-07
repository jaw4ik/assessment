using System.Web;
using System.Web.Security;

namespace easygenerator.Web.Components
{
    public interface IAuthenticationProvider
    {
        bool IsUserAuthenticated();
    }

    public class AuthenticationProvider : IAuthenticationProvider
    {
        public bool IsUserAuthenticated()
        {
            return HttpContext.Current.User != null && HttpContext.Current.User.Identity.IsAuthenticated;
        }
    }
}
