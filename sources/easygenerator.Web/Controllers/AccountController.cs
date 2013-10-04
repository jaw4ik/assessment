using System;
using System.Net;
using System.Web.Mvc;
using System.Web.Security;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers
{
    [AllowAnonymous]
    public class AccountController : Controller
    {
        private IAuthenticationProvider _authenticationProvider;

        public AccountController(IAuthenticationProvider authenticationProvider)
        {
            _authenticationProvider = authenticationProvider;
        }

        [HttpGet]
        public ActionResult TryWithoutSignup()
        {
            return View("TryNow");
        }

        [HttpPost]
        public ActionResult TryWithoutSignup(object viewModel)
        {
            _authenticationProvider.SignIn(Guid.NewGuid().ToString(), true);

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
            if (System.Web.HttpContext.Current.User != null && System.Web.HttpContext.Current.User.Identity.IsAuthenticated)
                return RedirectToRoute("Default");
                
            return View();
        }

        public ActionResult LogIn()
        {
            return View();
        }

        public ActionResult LogOut()
        {
            if (System.Web.HttpContext.Current.User != null && System.Web.HttpContext.Current.User.Identity.IsAuthenticated)
                _authenticationProvider.SignOut();

            return RedirectToRoute("SignUp");
        }
    }
}
