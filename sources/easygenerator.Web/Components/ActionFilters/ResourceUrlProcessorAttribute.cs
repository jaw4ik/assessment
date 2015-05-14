using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionFilters
{
    public class ResourceUrlProcessorAttribute : ActionFilterAttribute
    {
        //redirect to correct url, should contain '/' in the end, to correctly process links to package files.
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var resourceUrlValue = filterContext.RouteData.Values["resourceUrl"];
            var resourceUrl = resourceUrlValue == null ? null : resourceUrlValue.ToString();

            if (!string.IsNullOrEmpty(resourceUrl))
                return;

            if (filterContext.HttpContext != null 
                && filterContext.HttpContext.Request != null 
                && filterContext.HttpContext.Request.Url != null)
            {
                if (!filterContext.HttpContext.Request.Url.AbsolutePath.EndsWith("/"))
                {
                    filterContext.Result = new RedirectResult(filterContext.HttpContext.Request.Url.AbsolutePath + "/");
                }
            }
            else
            {
                filterContext.Result = new EmptyResult();
            }
        }
    }
}