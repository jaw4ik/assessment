using System;
using System.Globalization;
using System.Threading;
using System.Web.Mvc;
using Autofac;
using Autofac.Core;
using easygenerator.Web.Components.ModelBinding;
using easygenerator.Web.Configuration;
using System.Web.Caching;
using easygenerator.Web.Mail;
using System.Web;
using System.Reflection;

namespace easygenerator.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
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

            StartTasks();
        }

        protected void StartTasks()
        {
            DependencyResolver.Current.GetService<MailSenderTask>().Start();
        }

        protected void Application_AcquireRequestState(object sender, EventArgs e)
        {
            if (Request.UserLanguages != null && Request.UserLanguages.Length > 0)
            {
                var culture = new CultureInfo(Request.UserLanguages[0]);
                Thread.CurrentThread.CurrentUICulture = culture;
                Thread.CurrentThread.CurrentCulture = culture;
            }
        }
    }
}