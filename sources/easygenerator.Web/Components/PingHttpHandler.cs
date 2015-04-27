using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Components
{
    public class PingHttpHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.Write("pong");
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}