using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Elmah;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.Owin;
using Microsoft.Owin.Diagnostics;
using Owin;

[assembly: OwinStartup(typeof(easygenerator.Web.Configuration.OwinConfiguration))]

namespace easygenerator.Web.Configuration
{
    public class ErrorHandlingPipelineModule : HubPipelineModule
    {
        protected override void OnIncomingError(ExceptionContext exceptionContext, IHubIncomingInvokerContext invokerContext)
        {
            ErrorLog.GetDefault(null).Log(new Error(exceptionContext.Error));
            if (exceptionContext.Error.InnerException != null)
            {
                ErrorLog.GetDefault(null).Log(new Error(exceptionContext.Error.InnerException));
            }
            base.OnIncomingError(exceptionContext, invokerContext);
        }
    }

    public class OwinConfiguration
    {
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=316888
            app.MapSignalR();
            app.UseErrorPage();
            GlobalHost.HubPipeline.AddModule(new ErrorHandlingPipelineModule());

        }
    }
}
