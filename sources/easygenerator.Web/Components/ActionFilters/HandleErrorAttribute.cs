using System.Web.Mvc;
using easygenerator.Web.Components.ActionResults;

namespace easygenerator.Web.Components.ActionFilters
{
    public class HandleErrorAttribute : System.Web.Mvc.HandleErrorAttribute
    {
        public override void OnException(ExceptionContext filterContext)
        {
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