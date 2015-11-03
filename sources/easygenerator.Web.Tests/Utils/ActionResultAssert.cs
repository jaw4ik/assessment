using System.Collections.Generic;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionResults;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Web.Tests.Utils
{
    public static class ActionResultAssert
    {
        internal static void IsViewResult(object result)
        {
            Assert.IsInstanceOfType(result, typeof(ViewResult));
        }

        internal static void IsViewResult(object result, object viewModel)
        {
            IsViewResult(result);
            var viewResult = result as ViewResult;
            Assert.IsNotNull(viewResult);
            Assert.IsNotNull(viewResult.Model);
            Assert.AreEqual(viewModel, viewResult.Model);
        }

        internal static void IsViewResult(object result, string viewName, object viewModel)
        {
            IsViewResult(result);
            var viewResult = result as ViewResult;
            Assert.IsNotNull(viewResult);
            Assert.AreEqual(viewResult.ViewName, viewName);
            Assert.AreEqual(viewModel, viewResult.Model);

        }

        internal static void IsViewResult(object result, string viewName)
        {
            IsViewResult(result);
            var viewResult = result as ViewResult;
            Assert.IsNotNull(viewResult);
            Assert.AreEqual(viewResult.ViewName, viewName);
        }

        internal static void IsPartialViewResult(object result)
        {
            Assert.IsInstanceOfType(result, typeof(PartialViewResult));
        }

        internal static void IsPartialViewResult(object result, string viewName)
        {
            Assert.IsInstanceOfType(result, typeof(PartialViewResult));
            var viewResult = result as PartialViewResult;
            Assert.IsNotNull(viewResult);
            Assert.AreEqual(viewResult.ViewName, viewName);
        }

        internal static void IsRedirectResult(object result, string url)
        {
            Assert.IsInstanceOfType(result, typeof(RedirectResult));

            var redirectResult = result as RedirectResult;
            Assert.IsNotNull(redirectResult);
            Assert.AreEqual(url, redirectResult.Url);
        }

        internal static void IsRedirectToRouteResult(object result)
        {
            Assert.IsInstanceOfType(result, typeof(RedirectToRouteResult));
        }

        internal static void IsRedirectToRouteResult(object result, string expectedRouteName)
        {
            IsRedirectToRouteResult(result);

            var redirectToRouteResult = result as RedirectToRouteResult;
            Assert.IsNotNull(redirectToRouteResult);
            Assert.AreEqual(expectedRouteName, redirectToRouteResult.RouteName);
        }

        internal static void IsRedirectToRouteResult(object result, string expectedRouteName, params KeyValuePair<string, object>[] routeValues)
        {
            IsRedirectToRouteResult(result);

            var redirectToRouteResult = result as RedirectToRouteResult;
            Assert.IsNotNull(redirectToRouteResult);
            Assert.AreEqual(expectedRouteName, redirectToRouteResult.RouteName);
            foreach (KeyValuePair<string, object> item in routeValues)
            {
                Assert.IsNotNull(redirectToRouteResult.RouteValues[item.Key]);
                Assert.AreEqual(item.Value, redirectToRouteResult.RouteValues[item.Key]);
            }
        }

        internal static void IsRedirectToActionResult(object result, string expectedActionName)
        {
            IsRedirectToRouteResult(result);

            var redirectToRouteResult = result as RedirectToRouteResult;
            Assert.IsNotNull(redirectToRouteResult);
            Assert.AreEqual(redirectToRouteResult.RouteValues["action"], expectedActionName);
        }

        internal static void IsHttpNotFoundActionResult(object result)
        {
            Assert.IsInstanceOfType(result, typeof(HttpNotFoundResult));
        }

        internal static void IsHttpStatusCodeResult(object result, int statusCode)
        {
            Assert.IsInstanceOfType(result, typeof(HttpStatusCodeResult));

            var httpStatusCodeResult = result as HttpStatusCodeResult;
            Assert.AreEqual(statusCode, httpStatusCodeResult.StatusCode);
        }

        internal static void IsBadRequestStatusCodeResult(object result)
        {
            IsHttpStatusCodeResult(result, 400);
        }

        internal static void IsJsonResult(object result)
        {
            Assert.IsInstanceOfType(result, typeof(JsonResult));
        }

        internal static void IsJsonErrorResult(object result)
        {
            Assert.IsInstanceOfType(result, typeof(JsonErrorResult));
        }

        internal static void IsJsonSuccessResult(object result)
        {
            Assert.IsInstanceOfType(result, typeof(JsonSuccessResult));
        }

        internal static void IsJsonSuccessResult(object result, object data)
        {
            Assert.IsInstanceOfType(result, typeof(JsonSuccessResult));

            var jsonSuccessResult = result as JsonSuccessResult;
            Assert.AreEqual(data, jsonSuccessResult.Data);
        }
    }
}
