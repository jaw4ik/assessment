using System.Linq;
using easygenerator.Infrastructure;
using System.Collections.Generic;
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
            MagickImageResizerConfiguration.Configure();
        }

        protected void Application_AcquireRequestState(object sender, EventArgs e)
        {
            var culture = new CultureInfo(Constants.DefaultCulture);
            var userCultures = Request.UserLanguages;
            if (userCultures != null)
            {
                foreach (var userCulture in userCultures)
                {
                    var supportedCulture = Constants.SupportedCultures.FirstOrDefault(s => userCulture.ToLower().StartsWith(s));
                    if (supportedCulture != null)
                    {
                        culture = new CultureInfo(supportedCulture);
                        break;
                    }
                }
            }

            Thread.CurrentThread.CurrentCulture = culture;
            Thread.CurrentThread.CurrentUICulture = culture;
        }

        protected void Application_PreSendRequestHeaders(object sender, EventArgs e)
        {
            var fontTypes = Constants.fontTypes;

            if(fontTypes.Contains(Response.ContentType))
            {
                var headers = new Dictionary<string, object>();
                Response.Headers.CopyTo(headers);

                Response.ClearHeaders();

                headers.ToList().ForEach(header => Response.AddHeader(header.Key, (string)header.Value));
            }
        }
    }
}