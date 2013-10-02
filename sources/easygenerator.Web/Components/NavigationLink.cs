using System;
using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace easygenerator.Web.Components
{
    public static class NavigationLinkHelper
    {
        public static MvcHtmlString NavigationLink(this HtmlHelper htmlHelper, string linkText, string actionName, string controllerName, string cssClass)
        {
            if (cssClass == null) throw new ArgumentNullException("cssClass");
            string currentAction = htmlHelper.ViewContext.RouteData.GetRequiredString("action");
            string currentController = htmlHelper.ViewContext.RouteData.GetRequiredString("controller");

            if (actionName == currentAction && controllerName == currentController)
            {
                return htmlHelper.ActionLink(linkText, actionName, controllerName, null, new { @class = cssClass });
            }

            return htmlHelper.ActionLink(linkText, actionName, controllerName, null, new { @class = cssClass });
        }
    }
}