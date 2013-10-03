using System.Web.Security;

namespace easygenerator.Web.Components
{
    public interface IAuthenticationProvider
    {
        void SignIn(string username, bool isPersistent);
        void SignOut();
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
    }
}
