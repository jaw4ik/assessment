using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Description;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class ForbiddenResult : ActionResult
    {
        private readonly string _resourceKey;
        private const string ErrorMessageResourceKeyHeader = "ErrorMessageResourceKey";

        public ForbiddenResult(string resourceKey)
        {
            _resourceKey = resourceKey;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            var result = new HttpStatusCodeResult(403);

            var httpResponse = context.RequestContext.HttpContext.Response;

            httpResponse.TrySkipIisCustomErrors = true;
            httpResponse.AppendHeader(ErrorMessageResourceKeyHeader, _resourceKey);

            result.ExecuteResult(context);
        }
    }
}