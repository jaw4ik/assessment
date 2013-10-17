﻿using System;
using System.Web.Mvc;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.ViewModels.Account;

namespace easygenerator.Web.Controllers
{
    [AllowAnonymous]
    public class AccountController : DefaultController
    {
        private readonly IAuthenticationProvider _authenticationProvider;
        private readonly IUserRepository _repository;
        private readonly IHelpHintRepository _helpHintRepository;

        public AccountController(IAuthenticationProvider authenticationProvider, IUserRepository repository, IHelpHintRepository helpHintRepository)
        {
            _authenticationProvider = authenticationProvider;
            _repository = repository;
            _helpHintRepository = helpHintRepository;
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
            {
                var user = Guid.NewGuid().ToString();
                _authenticationProvider.SignIn(user, true);
                _helpHintRepository.CreateHelpHintsForUser(user);
            }

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
            {
                return RedirectToRoute("Default");
            }

            if (!IsSessionWithUserSignupModelExist())
            {
                return RedirectToRoute("SignUp");
            }

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

        private bool IsSessionWithUserSignupModelExist()
        {
            return Session[Constants.SessionConstants.UserSignUpModel] is UserSignUpViewModel;
        }
    }
}
