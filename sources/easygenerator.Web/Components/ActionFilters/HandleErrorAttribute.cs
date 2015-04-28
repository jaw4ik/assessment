using easygenerator.Web.Components.ActionResults;
using System;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionFilters
{
    public class HandleErrorAttribute : System.Web.Mvc.HandleErrorAttribute
    {
        public override void OnException(ExceptionContext filterContext)
        {
            var exception = filterContext.Exception;
            if (exception is ArgumentException)
            {
                filterContext.Result = new HttpStatusCodeWithMessageResult(422, exception.Message);
                filterContext.ExceptionHandled = true;
                return;
            }

            if (filterContext.HttpContext.Request.IsAjaxRequest())
            {
                filterContext.Result = new JsonErrorResult(filterContext.Exception.Message);
                filterContext.ExceptionHandled = true;
            }
            else
            {
                base.OnException(filterContext);
            }
        }
    }
}