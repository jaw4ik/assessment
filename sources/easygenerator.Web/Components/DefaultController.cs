using System;
using System.Net;
using System.Web.Mvc;
using easygenerator.DataAccess;
using easygenerator.Web.Components.ActionResults;

namespace easygenerator.Web.Components
{
    public abstract class DefaultController : Controller
    {
        protected override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            DependencyResolver.Current.GetService<IDataContext>().Save();
        }

        protected ActionResult JsonSuccess()
        {
            return new JsonSuccessResult();
        }

        protected ActionResult JsonSuccess(object data)
        {
            return new JsonSuccessResult(data);
        }

        protected ActionResult JsonError(string message)
        {
            return new JsonErrorResult(message);
        }

        protected ActionResult BadRequest()
        {
            return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
        }

        protected string GetCurrentUsername()
        {
            return String.IsNullOrEmpty(User.Identity.Name) ? "Anonymous" : User.Identity.Name;
        }
    }
}