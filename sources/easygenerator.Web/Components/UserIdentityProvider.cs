using System;
using System.Web;

namespace easygenerator.Web.Components
{
    public interface IUserIdentityProvider
    {
        string GetCurrentUsername();
    }

    public class UserIdentityProvider : IUserIdentityProvider
    {
        public virtual string GetCurrentUsername()
        {
            var name = HttpContext.Current.User.Identity.Name;
            return String.IsNullOrEmpty(name) ? "Anonymous" : name;
        }
    }
}