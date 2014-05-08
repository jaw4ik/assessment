using NSubstitute;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Tests.Utils
{
    public static class Extensions
    {
        public static void AddRandomModelStateError(this Controller controller)
        {
            controller.ModelState.AddModelError("error", "I am a fake error!");
        }

        public static void SetRequestAjaxHeaders(this HttpRequestBase request)
        {
            request.Headers.Returns(new WebHeaderCollection()
            {
                {"X-Requested-With", "XMLHttpRequest"}
            });
        }
    }
}
