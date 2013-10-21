using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Components
{
    public interface IUrlHelperWrapper
    {
        string RouteRestorePasswordUrl(string ticketId);
    }

    public class UrlHelperWrapper : IUrlHelperWrapper
    {
        public string RouteRestorePasswordUrl(string ticketId)
        {
            var httpRequest = HttpContext.Current.Request;
            return new UrlHelper(httpRequest.RequestContext).RouteUrl("PasswordRecovery", new { ticketId = ticketId }, httpRequest.Url.Scheme);
        }
    }
}