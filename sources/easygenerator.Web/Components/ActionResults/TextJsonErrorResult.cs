using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class TextJsonErrorResult : JsonErrorResult
    {
        public TextJsonErrorResult(string message) : base(message)
        {
        }

        public override void ExecuteResult(ControllerContext context)
        {
            var jsonResult = new JsonResult
            {
                Data = new { success = false, message = Message },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                ContentType = System.Net.Mime.MediaTypeNames.Text.Html
            };

            jsonResult.ExecuteResult(context);
        }
    }
}