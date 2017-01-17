using easygenerator.Auth.Attributes.Mvc;
using easygenerator.DomainModel.Entities.Tickets;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;
using easygenerator.Web.WooCommerce;
using System.Web.Mvc;
using easygenerator.Web.Security.BruteForceLoginProtection;

namespace easygenerator.Web.Controllers
{
    [AllowAnonymous]
    public class AccountController : DefaultController
    {
        private readonly IAuthenticationProvider _authenticationProvider;
        private readonly IUserRepository _repository;
        private readonly IWooCommerceAutologinUrlProvider _wooCommerceAutologinUrlProvider;
        private readonly IIPInfoProvider _ipInfoProvider;
        private readonly IBruteForceLoginProtectionManager _bruteForceLoginProtectionManager;

        public AccountController(IAuthenticationProvider authenticationProvider, IUserRepository repository, IWooCommerceAutologinUrlProvider wooCommerceAutologinUrlProvider,
            IIPInfoProvider ipInfoProvider, IBruteForceLoginProtectionManager bruteForceLoginProtectionManager)
        {
            _authenticationProvider = authenticationProvider;
            _repository = repository;
            _wooCommerceAutologinUrlProvider = wooCommerceAutologinUrlProvider;
            _ipInfoProvider = ipInfoProvider;
            _bruteForceLoginProtectionManager = bruteForceLoginProtectionManager;
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
            ViewBag.ClickOnLogoDisabled = true;
            var redirectUrl =  _bruteForceLoginProtectionManager.GetUrlWithCaptcha(HttpContext, _ipInfoProvider.GetIP(HttpContext));
            if (redirectUrl != null)
            {
                return Redirect(redirectUrl);
            }
            return View();
        }

        [NoCache]
        public ActionResult SignUpSecondStep()
        {
            ViewBag.ClickOnLogoDisabled = true;
            ViewBag.NavigationLinksAreDisabled = true;

            return View();
        }

        [NoCache]
        public ActionResult SignIn()
        {
            var redirectUrl = _bruteForceLoginProtectionManager.GetUrlWithCaptcha(HttpContext, _ipInfoProvider.GetIP(HttpContext));
            if (redirectUrl != null)
            {
                return Redirect(redirectUrl);
            }
            return View();
        }

        [NoCache]
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

            return RedirectToRoute("Default");
        }

        [NoCache]
        [HttpGet]
        [Route("email/confirmation/{ticketId}", Name = "EmailConfirmation")]
        public ActionResult EmailConfirmation(EmailConfirmationTicket ticket)
        {
            if (ticket == null)
            {
                return HttpNotFound();
            }

            ticket.User.ConfirmEmailUsingTicket(ticket);

            ViewBag.NavigationLinksAreDisabled = true;
            return View("EmailConfirmed");
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

        [Route("account/upgrade"), Scope("upgradeAccount")]
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
