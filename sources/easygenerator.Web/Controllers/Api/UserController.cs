using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Handlers;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Extensions;
using easygenerator.Web.Mail;
using easygenerator.Web.ViewModels.Account;
using System;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class UserController : DefaultController
    {
        private readonly IUserRepository _repository;
        private readonly IEntityFactory _entityFactory;
        private readonly IAuthenticationProvider _authenticationProvider;
        private readonly ISignupFromTryItNowHandler _signupFromTryItNowHandler;
        private readonly IDomainEventPublisher<UserSignedUpEvent> _publisher;
        private readonly IMailSenderWrapper _mailSenderWrapper;
        private readonly ConfigurationReader _configurationReader;

        public UserController(IUserRepository repository,
            IEntityFactory entityFactory,
            IAuthenticationProvider authenticationProvider,
            ISignupFromTryItNowHandler signupFromTryItNowHandler,
            IDomainEventPublisher<UserSignedUpEvent> publisher,
            IMailSenderWrapper mailSenderWrapper,
            ConfigurationReader configurationReader)
        {
            _repository = repository;
            _entityFactory = entityFactory;
            _authenticationProvider = authenticationProvider;
            _signupFromTryItNowHandler = signupFromTryItNowHandler;
            _publisher = publisher;
            _mailSenderWrapper = mailSenderWrapper;
            _configurationReader = configurationReader;
        }

        [HttpPost]
        [AllowAnonymous]
        [WooCommerceTokenAuthorize]
        [Route("api/user/update")]
        public ActionResult Update(string email, 
            string password = "",
            string firstName = "", 
            string lastName = "",
            string phone = "", 
            string organization = "", 
            string country = "")
        {
            if (string.IsNullOrEmpty(email))
                return BadRequest("Not valid email");

            var user = _repository.GetUserByEmail(email);
            if (user == null)
                return BadRequest("User does not exist");

            if (!string.IsNullOrEmpty(password))
            {
                if (!user.IsPasswordValid(password))
                    return BadRequest("Not valid password");

                user.UpdatePassword(password, email);
            }
            if (!string.IsNullOrEmpty(firstName))
            {
                user.UpdateFirstName(firstName, email);
            }
            if (!string.IsNullOrEmpty(lastName))
            {
                user.UpdateLastName(lastName, email);
            }
            if (!string.IsNullOrEmpty(phone))
            {
                user.UpdatePhone(phone, email);
            }
            if (!string.IsNullOrEmpty(organization))
            {
                user.UpdateOrganization(organization, email);
            }
            if (!string.IsNullOrEmpty(country))
            {
                var countryName = PhoneCodeCollection.GetCountryByCode(country);
                if (countryName == null)
                    return BadRequest("Not valid country code");

                user.UpdateCountry(countryName, email);
            }

            return Success("true");
        }

        [HttpPost]
        [AllowAnonymous]
        [WooCommerceTokenAuthorize]
        [Route("api/user/update-subscription")]
        public ActionResult UpdateSubscription(string email, long? exp_date, AccessType? plan)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Not valid email");
            }

            var user = _repository.GetUserByEmail(email);
            if (user == null)
            {
                return BadRequest("User does not exist");
            }

            if (plan.HasValue)
            {
                if (!Enum.IsDefined(typeof(AccessType), plan.Value))
                    return BadRequest("Plan is not valid");

                if (exp_date.HasValue)
                {
                    user.Subscription.UpdatePlan(plan.Value, new DateTime(exp_date.Value));
                }
                else
                {
                    user.Subscription.UpdatePlan(plan.Value, null);
                }
            }

            return Success("true");
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Signin(string username, string password)
        {
            var user = _repository.GetUserByEmail(username);
            if (user == null || !user.VerifyPassword(password))
            {
                return JsonError(AccountRes.Resources.IncorrectEmailOrPassword);
            }

            _authenticationProvider.SignIn(username, true);
            return JsonSuccess();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Signup(UserSignUpViewModel profile)
        {
            if (_repository.GetUserByEmail(profile.Email) != null)
            {
                return JsonError("Account with this email already exists");
            }

            var trialPeriodExpires = DateTimeWrapper.Now().AddMinutes(_configurationReader.UserTrialPeriod);
            var subscription = _entityFactory.UserSubscription(AccessType.Starter, trialPeriodExpires);
            var user = _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone,
                profile.Organization, profile.Country, profile.Email, new UserSettings(profile.Email, true), subscription);

            _repository.Add(user);
            _publisher.Publish(new UserSignedUpEvent(user, profile.PeopleBusyWithCourseDevelopmentAmount, profile.NeedAuthoringTool, profile.UsedAuthoringTool));

            if (User.Identity.IsAuthenticated && _repository.GetUserByEmail(User.Identity.Name) == null)
            {
                _signupFromTryItNowHandler.HandleOwnership(User.Identity.Name, user.Email);
            }

            _authenticationProvider.SignIn(profile.Email, true);

            return JsonSuccess(profile.Email);
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult ForgotPassword(string email)
        {
            var user = _repository.GetUserByEmail(email);

            if (user != null)
            {
                var ticket = _entityFactory.PasswordRecoveryTicket(user);
                user.AddPasswordRecoveryTicket(ticket);

                _mailSenderWrapper.SendForgotPasswordMessage(email, ticket.Id.ToNString());
            }

            return JsonSuccess();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult RecoverPassword(PasswordRecoveryTicket ticket, string password)
        {
            if (ticket == null)
            {
                return JsonError("Ticket does not exist");
            }

            ticket.User.RecoverPasswordUsingTicket(ticket, password);

            return JsonSuccess();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Exists(string email)
        {
            var exists = _repository.GetUserByEmail(email) != null;
            return JsonSuccess(exists);
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult GetCurrentUserInfo()
        {
            var user = _repository.GetUserByEmail(GetCurrentUsername());

            return JsonSuccess(new
            {
                IsShowIntroductionPage = (user == null) || user.UserSetting.IsShowIntroductionPage,
                IsRegisteredOnAim4You = false
            });
        }

        [HttpPost]
        [Route("api/identify")]
        public ActionResult Identify()
        {
            var user = _repository.GetUserByEmail(GetCurrentUsername());

            if (user == null)
            {
                return Json(new { });
            }

            return Json(new { email = user.Email, fullname = user.FullName, accessType = user.Subscription.AccessType });

        }

        [HttpPost]
        public ActionResult SetIsShowIntroductionPage(bool isShowIntroduction)
        {
            var user = _repository.GetUserByEmail(GetCurrentUsername());
            if (user != null && user.UserSetting.IsShowIntroductionPage != isShowIntroduction)
            {
                user.UserSetting.UpdateIsShowIntroduction(isShowIntroduction);
            }
            return JsonSuccess();
        }
    }
}
