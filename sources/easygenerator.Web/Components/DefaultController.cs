using easygenerator.Infrastructure;
using easygenerator.Web.Components.ActionResults;
using System;
using System.Net;
using System.Web.Mvc;

namespace easygenerator.Web.Components
{
    public abstract class DefaultController : Controller
    {
        protected override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            DependencyResolver.Current.GetService<IUnitOfWork>().Save();
        }

        protected ActionResult JsonSuccess()
        {
            return new JsonSuccessResult();
        }

        protected ActionResult ForbiddenResult()
        {
            return new ForbiddenResult();
        }

        protected ActionResult JsonSuccess(object data)
        {
            return new JsonSuccessResult(data);
        }

        protected ActionResult JsonSuccess(object data, string contentType)
        {
            return new JsonSuccessResult(data, contentType);
        }

        protected ActionResult JsonError(string message)
        {
            return new JsonErrorResult(message);
        }

        protected ActionResult JsonLocalizableError(string message, string resourceKey)
        {
            return new JsonErrorResult(message, resourceKey);
        }

        public ActionResult JsonDataResult(object data)
        {
            return new JsonDataResult(data);
        }

        public ActionResult JsonDataResult(object data, string contentType)
        {
            return new JsonDataResult(data, contentType);
        }

        protected ActionResult Success()
        {
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        protected ActionResult BadRequest()
        {
            return new BadRequestResult();
        }

        protected string GetCurrentUsername()
        {
            return String.IsNullOrEmpty(User.Identity.Name) ? "Anonymous" : User.Identity.Name;
        }

        public string GetCurrentDomain()
        {
            if (Request != null && Request.Url != null)
            {
                return Request.Url.Scheme + Uri.SchemeDelimiter + Request.Url.Host +
                       (Request.Url.IsDefaultPort ? "" : ":" + Request.Url.Port);
            }
            return null;
        }
    }
}