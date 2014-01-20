using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class ForbiddenResult : ActionResult
    {
        private readonly string _resourceKey;

        public ForbiddenResult(string resourceKey)
        {
            _resourceKey = resourceKey;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            HttpResponseBase response = context.HttpContext.Response;
            response.TrySkipIisCustomErrors = true;
            response.StatusCode = 403;
            response.StatusDescription = _resourceKey;
            response.End();
        }
    }
}