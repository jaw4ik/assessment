using System.Web.Mvc;
using easygenerator.Web.Configuration;

namespace easygenerator.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            BundleConfiguration.Configure();
            RouteConfiguration.Configure();
            FilterConfiguration.Configure();
            ContainerConfiguration.Configure();
        }
    }
}