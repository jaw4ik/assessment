using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Components.ActionResults
{
    public class TextJsonSuccessResult : JsonSuccessResult
    {
        public TextJsonSuccessResult()
        {
        }

        public TextJsonSuccessResult(object data) : base(data)
        {
        }

        public override void ExecuteResult(ControllerContext context)
        {
            var jsonResult = new JsonResult
            {
                Data = new { success = true, message = Message, data = Data },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                ContentType = System.Net.Mime.MediaTypeNames.Text.Html
            };

            jsonResult.ExecuteResult(context);
        }
    }
}