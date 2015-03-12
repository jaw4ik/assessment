﻿using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;
using easygenerator.Web.WooCommerce;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers
{
    [AllowAnonymous]
    public class AccountController : DefaultController
    {
        private readonly IAuthenticationProvider _authenticationProvider;
        private readonly IUserRepository _repository;
        private readonly IWooCommerceAutologinUrlProvider _wooCommerceAutologinUrlProvider;

        public AccountController(IAuthenticationProvider authenticationProvider, IUserRepository repository, IWooCommerceAutologinUrlProvider wooCommerceAutologinUrlProvider)
        {
            _authenticationProvider = authenticationProvider;
            _repository = repository;
            _wooCommerceAutologinUrlProvider = wooCommerceAutologinUrlProvider;
        }

        public ActionResult PrivacyPolicy()
        {
            ViewBag.ClickOnLogoDisabled = true;
            ViewBag.NavigationLinksAreDisabled = true;

            return View();
        }

        public ActionResult TermsOfUse()
        {
            ViewBag.ClickOnLogoDisabled = true;
            ViewBag.NavigationLinksAreDisabled = true;

            return View();
        }

        [NoCache]
        public ActionResult SignUp()
        {
            if (IsExistingUserAuthenticated())
                return RedirectToRoute("Default");

            ViewBag.ClickOnLogoDisabled = true;

            return View();
        }

        [NoCache]
        public ActionResult SignUpSecondStep()
        {
            if (IsExistingUserAuthenticated())
            {
                return RedirectToRoute("Default");
            }

            ViewBag.ClickOnLogoDisabled = true;
            ViewBag.NavigationLinksAreDisabled = true;

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

        [NoCache]
        public ActionResult Register()
        {
            if (IsExistingUserAuthenticated())
                return RedirectToRoute("Default");

            ViewBag.ClickOnLogoDisabled = true;
            ViewBag.NavigationLinksAreDisabled = true;

            return View("SignUp");
        }

        [Route("account/upgrade")]
        public ActionResult UpgradeAccount()
        {
            return Redirect(_wooCommerceAutologinUrlProvider.GetAutologinUrl(User.Identity.Name));
        }

        private bool IsExistingUserAuthenticated()
        {
            return _authenticationProvider.IsUserAuthenticated() && _repository.GetUserByEmail(User.Identity.Name) != null;
        }
    }
}
