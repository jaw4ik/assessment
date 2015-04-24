using System.Linq;
using easygenerator.Infrastructure;
using easygenerator.Web.Configuration;
using System;
using System.Globalization;
using System.Threading;
using System.Web.Mvc;

namespace easygenerator.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            ModelBinderConfiguration.Configure();
            BundleConfiguration.Configure();
            FilterConfiguration.Configure();
            ContainerConfiguration.Configure();
            RouteConfiguration.Configure();
            TaskConfiguration.Configure();
            JsonFormatterConfiguration.Configure();
        }

        protected void Application_AcquireRequestState(object sender, EventArgs e)
        {
            var culture = new CultureInfo(Constants.DefaultCulture);
            var userCultures = Request.UserLanguages;
            if (userCultures != null)
            {
                foreach (var userCulture in userCultures)
                {
                    var item = userCulture.Split(';')[0];
                    if (Constants.SupportedCultures.Any(s => String.Equals(s, item, StringComparison.CurrentCultureIgnoreCase)))
                    {
                        culture = new CultureInfo(item);
                        break;
                    }
                }
            }

            Thread.CurrentThread.CurrentCulture = culture;
            Thread.CurrentThread.CurrentUICulture = culture;
        }


    }
}