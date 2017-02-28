using LtiLibrary.Core.Common;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using AppFunc = System.Func<System.Collections.Generic.IDictionary<string, object>, System.Threading.Tasks.Task>;

namespace easygenerator.Auth.Lti
{
    public class LtiExceptionHandler
    {
        private readonly AppFunc _next;

        public LtiExceptionHandler(AppFunc next)
        {
            if (next == null)
            {
                throw new ArgumentNullException(nameof(next));
            }

            _next = next;
        }

        public async Task Invoke(IDictionary<string, object> environment)
        {
            try
            {
                await _next(environment);
            }
            catch (LtiException ex)
            {
                var owinContext = new OwinContext(environment);

                HandleException(ex, owinContext);
            }
        }
        private void HandleException(Exception ex, IOwinContext context)
        {
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ReasonPhrase = "Internal Server Error";
            context.Response.ContentType = System.Net.Mime.MediaTypeNames.Text.Plain;
            context.Response.Write(ex.Message);
        }

    }
}

