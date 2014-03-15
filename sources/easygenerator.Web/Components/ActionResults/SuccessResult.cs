using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class SuccessResult : HttpStatusCodeResult
    {
        private readonly string _responseText;

        public SuccessResult(string responseText = "")
            : base(HttpStatusCode.OK)
        {
            _responseText = responseText;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            var httpResponse = context.RequestContext.HttpContext.Response;

            if (!string.IsNullOrEmpty(_responseText))
            {
                httpResponse.Clear();
                httpResponse.Write(_responseText);
            }
            
            base.ExecuteResult(context);
        }
    }
}