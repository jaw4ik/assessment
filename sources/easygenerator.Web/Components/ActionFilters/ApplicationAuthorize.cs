using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionFilters
{
    public class ApplicationAuthorize : AuthorizeAttribute
    {
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            var httpContext = filterContext.HttpContext;
            var request = httpContext.Request;
            var response = httpContext.Response;

            if (request.IsAjaxRequest())
                response.SuppressFormsAuthenticationRedirect = true;

            base.HandleUnauthorizedRequest(filterContext);
        }
    }
}