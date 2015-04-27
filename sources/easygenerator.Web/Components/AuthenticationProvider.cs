using System.Web;
using System.Web.Security;

namespace easygenerator.Web.Components
{
    public interface IAuthenticationProvider
    {
        void SignIn(string username, bool isPersistent);
        void SignOut();
        bool IsUserAuthenticated();
    }

    public class AuthenticationProvider : IAuthenticationProvider
    {
        public void SignIn(string username, bool createPersistentCookie)
        {
            FormsAuthentication.SetAuthCookie(username, createPersistentCookie);
        }

        public void SignOut()
        {
            FormsAuthentication.SignOut();
        }

        public bool IsUserAuthenticated()
        {
            return HttpContext.Current.User != null && HttpContext.Current.User.Identity.IsAuthenticated;
        }
    }
}
