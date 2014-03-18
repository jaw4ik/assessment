using easygenerator.DataAccess;
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

        protected ActionResult Success()
        {
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        protected ActionResult BadRequest()
        {
            return new BadRequestResult();
        }

        protected ActionResult BadRequest(string message)
        {
            return new BadRequestResult(message);
        }

        protected ActionResult UnprocessableEntity(string message)
        {
            return new HttpStatusCodeWithMessageResult(422, message);
        }

        protected string GetCurrentUsername()
        {
            return String.IsNullOrEmpty(User.Identity.Name) ? "Anonymous" : User.Identity.Name;
        }
    }
}