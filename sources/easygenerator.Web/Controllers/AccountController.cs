using System;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using System.Web.Security;
using easygenerator.DataAccess.Repositories;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers
{
    [AllowAnonymous]
    public class AccountController : Controller
    {
        private readonly IAuthenticationProvider _authenticationProvider;

        public AccountController(IAuthenticationProvider authenticationProvider)
        {
            _authenticationProvider = authenticationProvider;
        }

        [HttpGet]
        public ActionResult TryWithoutSignup()
        {
            if (_authenticationProvider.IsUserAuthenticated())
                return RedirectToRoute("Default");

            return View("TryNow");
        }

        [HttpPost]
        public ActionResult TryWithoutSignup(object viewModel)
        {
            if (!_authenticationProvider.IsUserAuthenticated())
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
            if (_authenticationProvider.IsUserAuthenticated())
                return RedirectToRoute("Default");

            return View();
        }

        public ActionResult SignIn()
        {
            if (_authenticationProvider.IsUserAuthenticated())
                return RedirectToRoute("Default");

            return View();
        }

        public ActionResult SignupFromTry()
        {
            return View("SignUp");
        }

        public ActionResult SignOut()
        {
            return LogoutAndRedirectToRoute("SignIn");
        }

        private ActionResult LogoutAndRedirectToRoute(string routeToRedirect)
        {
            if (_authenticationProvider.IsUserAuthenticated())
                _authenticationProvider.SignOut();

            return RedirectToRoute(routeToRedirect);
        }
    }
}
