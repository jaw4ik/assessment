using easygenerator.DomainModel;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Handlers;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Extensions;
using easygenerator.Web.Import.PublishedCourse;
using easygenerator.Web.Mail;
using easygenerator.Web.ViewModels.Account;
using System;
using System.IO;
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
        private readonly IDomainEventPublisher _eventPublisher;
        private readonly IMailSenderWrapper _mailSenderWrapper;
        private readonly PublishedCourseImporter _publishedCourseImporter;
        private readonly ICourseRepository _courseRepository;

        public UserController(IUserRepository repository,
            IEntityFactory entityFactory,
            IAuthenticationProvider authenticationProvider,
            ISignupFromTryItNowHandler signupFromTryItNowHandler,
            IDomainEventPublisher eventPublisher,
            IMailSenderWrapper mailSenderWrapper,
            PublishedCourseImporter publishedCourseImporter,
            ICourseRepository courseRepository)
        {
            _repository = repository;
            _entityFactory = entityFactory;
            _authenticationProvider = authenticationProvider;
            _signupFromTryItNowHandler = signupFromTryItNowHandler;
            _eventPublisher = eventPublisher;
            _mailSenderWrapper = mailSenderWrapper;
            _publishedCourseImporter = publishedCourseImporter;
            _courseRepository = courseRepository;
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("wooCommerce")]
        [Route("api/user/update")]
        public ActionResult Update(string email,
            string password = "",
            string firstName = "",
            string lastName = "",
            string phone = "",
            string organization = "",
            string country = "")
        {
            var user = _repository.GetUserByEmail(email);
            if (user == null)
                throw new ArgumentException("User with specified email does not exist", "email");

            if (!string.IsNullOrEmpty(password))
                user.UpdatePassword(password, email);

            if (!string.IsNullOrEmpty(firstName))
                user.UpdateFirstName(firstName, email);

            if (!string.IsNullOrEmpty(lastName))
                user.UpdateLastName(lastName, email);

            if (!string.IsNullOrEmpty(phone))
                user.UpdatePhone(phone, email);

            if (!string.IsNullOrEmpty(organization))
                user.UpdateOrganization(organization, email);

            if (!string.IsNullOrEmpty(country))
            {
                var countryName = CountriesInfo.GetCountryName(country);
                if (countryName == null)
                    throw new ArgumentException("Not valid country code", "country");

                user.UpdateCountry(countryName, email);
            }

            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("wooCommerce")]
        [Route("api/user/downgrade")]
        public ActionResult Downgrade(string email)
        {
            var user = _repository.GetUserByEmail(email);
            if (user == null)
                throw new ArgumentException("User with specified email does not exist", "email");

            user.DowngradePlanToFree();

            _eventPublisher.Publish(new UserDonwgraded(user));

            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("wooCommerce")]
        [Route("api/user/subscription/starter")]
        public ActionResult UpgradeToStarter(string email, DateTime? expirationDate)
        {
            if (!expirationDate.HasValue)
                throw new ArgumentException("Expiration date is not specified or specified in wrong format", "expirationDate");

            var user = _repository.GetUserByEmail(email);
            if (user == null)
                throw new ArgumentException("User with specified email does not exist", "email");

            user.UpgradePlanToStarter(expirationDate.Value);

            _eventPublisher.Publish(new UserUpgradedToStarter(user));

            return Success();
        }

        [HttpPost]
        [CustomRequireHttps]
        [AllowAnonymous]
        [ExternalApiAuthorize("wooCommerce")]
        [Route("api/user/subscription/plus")]
        public ActionResult UpgradeToPlus(string email, DateTime? expirationDate)
        {
            if (!expirationDate.HasValue)
                throw new ArgumentException("Expiration date is not specified or specified in wrong format", "expirationDate");

            var user = _repository.GetUserByEmail(email);
            if (user == null)
                throw new ArgumentException("User with specified email does not exist", "email");

            user.UpgradePlanToPlus(expirationDate.Value);

            _eventPublisher.Publish(new UserUpgradedToPlus(user));

            return Success();
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

            var user = _entityFactory.User(profile.Email, profile.Password, profile.FirstName, profile.LastName, profile.Phone,
                profile.Country, profile.Email);

            _repository.Add(user);
            _eventPublisher.Publish(new UserSignedUpEvent(user, profile.Password, profile.UserRole, profile.RequestIntroductionDemo));

            if (User.Identity.IsAuthenticated && _repository.GetUserByEmail(User.Identity.Name) == null)
            {
                _signupFromTryItNowHandler.HandleOwnership(User.Identity.Name, user.Email);
            }

            _authenticationProvider.SignIn(profile.Email, true);

            var course = _publishedCourseImporter.Import(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Sample Course"), profile.Email);
            _courseRepository.Add(course);

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
        public ActionResult Exists(string email)
        {
            var exists = _repository.GetUserByEmail(email) != null;
            return JsonSuccess(exists);
        }

        [HttpPost]
        [Route("api/identify")]
        public ActionResult Identify()
        {
            var user = _repository.GetUserByEmail(GetCurrentUsername());

            if (user == null)
            {
                return JsonDataResult(new { });
            }

            return JsonDataResult(new { email = user.Email, firstname = user.FirstName, lastname = user.LastName, subscription = new { accessType = user.AccessType, expirationDate = user.ExpirationDate } });

        }

    }
}
