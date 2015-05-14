using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace easygenerator.Web.Components
{
    public static class NavigationLinkHelper
    {
        public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string actionName, string controllerName, string cssClass)
        {
            return NavigationLink(htmlHelper, linkText, actionName, controllerName, cssClass, false);
        }

        public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string actionName, string controllerName, string cssClass, bool openInNewWindow)
        {
            string currentAction = htmlHelper.ViewContext.RouteData.GetRequiredString("action");
            string currentController = htmlHelper.ViewContext.RouteData.GetRequiredString("controller");

            if (actionName == currentAction && controllerName == currentController)
            {
                return htmlHelper.Label(linkText, new { @class = cssClass + " active" });
            }

            var attributes = new { @class = cssClass, target = "_self" };
            if (openInNewWindow)
            {
                attributes = new { @class = cssClass, target = "_blank" };
            }
            
            return htmlHelper.ActionLink(linkText, actionName, controllerName, null, attributes);
        }
    }
}