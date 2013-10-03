using System;
using System.Web.Mvc;
using System.Web.Security;

namespace easygenerator.Web.Controllers
{
    [AllowAnonymous]
    public class AccountController : Controller
    {
        [HttpGet]
        public ActionResult TryWithoutSignup()
        {
            return View("TryNow");
        }

        [HttpPost]
        public ActionResult TryWithoutSignup(object viewModel)
        {
            FormsAuthentication.SetAuthCookie(Guid.NewGuid().ToString(), true);

            return RedirectToRoute("Default");
        }

        public ActionResult PrivacyPolicy()
        {
            return View();
        }

        public ActionResult TermsOfUse()
        {
            return View();
        }

        public ActionResult SignUp()
        {
            return View();
        }

        public ActionResult LogIn()
        {
            return View();
        }
    }
}
