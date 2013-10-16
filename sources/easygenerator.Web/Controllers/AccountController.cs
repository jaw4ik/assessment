using System;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using System.Web.Security;
using easygenerator.DataAccess.Repositories;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers
{
    [AllowAnonymous]
    public class AccountController : DefaultController
    {
        private readonly IAuthenticationProvider _authenticationProvider;
        private readonly IUserRepository _repository;

        public AccountController(IAuthenticationProvider authenticationProvider, IUserRepository repository)
        {
            _authenticationProvider = authenticationProvider;
            _repository = repository;
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
            return LaunchTryMode();
        }

        public ActionResult LaunchTryMode()
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
            if (IsExistingUserAuthenticated())
                return RedirectToRoute("Default");

            return View();
        }

        public ActionResult SignUpSecondStep()
        {
            if (IsExistingUserAuthenticated())
                return RedirectToRoute("Default");

            return View();
        }

        public ActionResult SignIn()
        {
            if (IsExistingUserAuthenticated())
                return RedirectToRoute("Default");

            return View();
        }

        public ActionResult SignOut()
        {
            if (_authenticationProvider.IsUserAuthenticated())
                _authenticationProvider.SignOut();

            return RedirectToRoute("SignIn");
        }

        private bool IsExistingUserAuthenticated()
        {
            return _authenticationProvider.IsUserAuthenticated() && _repository.GetUserByEmail(User.Identity.Name) != null;
        }
    }
}
