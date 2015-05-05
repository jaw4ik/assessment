using System.Web.Mvc;

namespace easygenerator.Web.Areas.Auth
{
    public class AuthAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Auth";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Auth_default",
                "auth/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}