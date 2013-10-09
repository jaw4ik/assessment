using System;
using System.Web;
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
            if (System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName] != null)
            {
                var authCookie = new HttpCookie(FormsAuthentication.FormsCookieName);
                authCookie.Expires = DateTime.Now.AddDays(-1d);
                System.Web.HttpContext.Current.Response.Cookies.Add(authCookie);
            }
            //FormsAuthentication.SignOut();
        }
    }
}
