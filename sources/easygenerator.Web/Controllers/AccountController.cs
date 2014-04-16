﻿using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;
using System;
using System.Web.Mvc;

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

        [NoCache]
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

        [NoCache]
        public ActionResult SignUp()
        {
            if (IsExistingUserAuthenticated())
                return RedirectToRoute("Default");

            return View();
        }

        [NoCache]
        public ActionResult SignUpSecondStep()
        {
            if (IsExistingUserAuthenticated())
            {
                return RedirectToRoute("Default");
            }

            return View();
        }

        [NoCache]
        public ActionResult SignIn()
        {
            if (IsExistingUserAuthenticated())
                return RedirectToRoute("Default");

            return View();
        }

        [NoCache]
        public ActionResult SignOut()
        {
            if (_authenticationProvider.IsUserAuthenticated())
                _authenticationProvider.SignOut();

            return RedirectToRoute("SignIn");
        }

        [HttpGet]
        public ActionResult PasswordRecovery(PasswordRecoveryTicket ticket)
        {
            if (ticket == null)
            {
                return View("InvalidPasswordRecovery");
            }

            return View("PasswordRecovery", new { ticketId = ticket.Id.ToNString() });
        }

        [HttpPost]
        public ActionResult PasswordRecovery(PasswordRecoveryTicket ticket, string password)
        {
            if (ticket == null)
            {
                return View("InvalidPasswordRecovery");
            }

            ticket.User.RecoverPasswordUsingTicket(ticket, password);
            _authenticationProvider.SignIn(ticket.User.Email, true);

            return RedirectToRoute("Default");
        }

        [Route("account/upgrade")]
        public ActionResult UpgradeAccount()
        {
            return Redirect("http://www.easygenerator.com/order-now");
        }

        private bool IsExistingUserAuthenticated()
        {
            return _authenticationProvider.IsUserAuthenticated() && _repository.GetUserByEmail(User.Identity.Name) != null;
        }
    }
}
