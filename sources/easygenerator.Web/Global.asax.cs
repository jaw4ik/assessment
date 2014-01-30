using System;
using System.Globalization;
using System.Threading;
using System.Web.Mvc;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ModelBinding;
using easygenerator.Web.Configuration;

namespace easygenerator.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            ModelBinderProviders.BinderProviders.Add(new EntityModelBinderProvider());
            ModelBinderProviders.BinderProviders.Add(new EntityCollectionModelBinderProvider());

            AreaRegistration.RegisterAllAreas();

            BundleConfiguration.Configure();
            FilterConfiguration.Configure();
            ContainerConfiguration.Configure();
            RouteConfiguration.Configure();
            TaskConfiguration.Configure();
        }

        protected void Application_AcquireRequestState(object sender, EventArgs e)
        {
            var enCulture = new CultureInfo("en-US");

            Thread.CurrentThread.CurrentCulture = enCulture;
            Thread.CurrentThread.CurrentUICulture = enCulture;
        }
    }
}